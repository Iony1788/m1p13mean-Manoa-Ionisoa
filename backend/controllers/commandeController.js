const { json } = require('body-parser');
const Commande = require('../models/Commande');
const Panier = require('../models/Panier');

exports.validerCommande = async (req, res) => {
    try {
        const userId = req.user.userId;

        const panier = await Panier.findOne({ acheteurProfile: userId });


        if (!panier || panier.produitsSnapshot.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Panier vide"
            });
        }

        const produitsSnapshot = panier.produitsSnapshot.map(p => p.toObject());
        console.log("Type:", typeof produitsSnapshot);
        console.log("Is Array:", Array.isArray(produitsSnapshot));
        const grouped = produitsSnapshot.reduce((acc, product) => {
            const boutiqueId = product.id_boutique.toString();

            if (!acc[boutiqueId]) {
                acc[boutiqueId] = [];
            }

            acc[boutiqueId].push(product);

            return acc;
        }, {});

        for (const boutiqueId in grouped) {

            const produits = grouped[boutiqueId];

            console.log("Boutique:", boutiqueId);
            console.log("Is array:", Array.isArray(produits));
            console.log("Value:", produits);


            // Calculate totals for this boutique
            const totalPrix = produits.reduce((sum, p) => {
                return sum + (p.prix * p.quantite);
            }, 0);

            const totalQuantite = produits.reduce((sum, p) => {
                return sum + p.quantite;
            }, 0);

            const nouvelleCommande = new Commande({
                acheteur: userId,
                id_boutique: boutiqueId,
                panier: panier._id,
                totalPrix: totalPrix,
                totalQuantite: totalQuantite,
                produitsSnapshot: produits
            });

            await nouvelleCommande.save();
        }


        panier.produitsSnapshot = [];
        await panier.save();

        res.status(201).json({
            success: true,
            message: "Commande enregistrée avec succès",
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur",
            error: error.message
        });
    }
};
exports.getCommandesParBoutique = async (req, res) => {
    try {
        const { boutiqueId } = req.params;

        const commandes = await Commande.find({ id_boutique: boutiqueId })
       
        .populate('acheteur', 'nom prenom');

         console.log(commandes);

        res.json(commandes);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur",
            error: error.message
        });
    }
};