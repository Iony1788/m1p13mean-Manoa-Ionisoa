import { Produit } from "./produit.model";

export interface Commande {
    _id?: string;
    acheteur: {
        nom: string;
        prenom: string;
    };
    id_boutique: string;
    panier: string;
    totalPrix: number;
    totalQuantite: number;
    produitsSnapshot: ProduitCommandeSnapshot[];
    dateAchat?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ProduitCommandeSnapshot {
    produitId: string;
    id_boutique: string;
    nom: string;
    prix: number;
    image?: string;
    quantite: number;
    subtotal?: number;
    _id: string;
}
