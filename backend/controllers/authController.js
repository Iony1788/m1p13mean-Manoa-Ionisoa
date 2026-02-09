const User = require('../models/user');
const RoleAssignment = require('../models/RoleAssignment');
const AdminProfile = require('../models/AdminProfile');
const AcheteurProfile = require('../models/AcheteurProfile');
const BoutiqueProfile = require('../models/boutique');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Générer le token JWT
// const generateToken = (user, role, profileId) => {
//     return jwt.sign(
//         { 
//             id: user._id, 
//             email: user.email,
//             role: role,
//             profileId: profileId 
//         },
//         process.env.JWT_SECRET,
//         { expiresIn: process.env.JWT_EXPIRE }
//     );
// };

const generateToken = (user, role, profileId) => {
    const payload = {
        userId: user._id,
        email: user.email,
        role: role,
        profileId: profileId
    };

    // Option 1: Utiliser une durée en secondes (ex: 24 heures = 86400 secondes)
    return jwt.sign(payload, process.env.JWT_SECRET, { 
        expiresIn: '24h' // Chaîne de caractères valide
        // ou expiresIn: 86400 // Nombre de secondes
    });

    // Option 2: Utiliser une chaîne représentant une durée
    // '1h' = 1 heure, '2d' = 2 jours, '7d' = 7 jours, etc.
    // return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Fonction pour créer un profil selon le rôle
const createProfileForUser = async (user, role, additionalData = {}, file = null) => {
    switch(role) {
        case 0: // Admin
            const adminProfile = await AdminProfile.create({
                name: additionalData.name || `${user.prenom} ${user.nom}`,
                user: user._id,
                ...additionalData
            });
            return { profile: adminProfile, profileType: 'adminProfile' };
        
        case 1: // Acheteur
            const acheteurData = {
                name: additionalData.name || `${user.prenom} ${user.nom}`,
                user: user._id,
                ...additionalData
            };
            if (file) {
                acheteurData.photo = `/uploads/profiles/${file.filename}`;
            }
            
            const acheteurProfile = await AcheteurProfile.create(acheteurData);
            return { profile: acheteurProfile, profileType: 'acheteurProfile' };
                
        case 2: // Boutique
            // Extrait les données de boutiqueProfile si elles existent
            const boutiqueData = additionalData.boutiqueProfile;
            
            const boutiqueProfile = await BoutiqueProfile.create({
                nom: boutiqueData.name || boutiqueData.nom || `Boutique de ${user.prenom}`,
                address: boutiqueData.address || '',
                phone: boutiqueData.phone || '',
                isValidated: false,
                user: user._id
            });
            return { profile: boutiqueProfile, profileType: 'boutiqueProfile' };
        
        default:
            throw new Error('Rôle invalide');
    }
};

// Inscription
exports.register = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: 'Requête invalide : corps de requête manquant'
            });
        }

        // Les champs texte viennent de req.body (parsés par multer)
        const { nom, prenom, email, password, role, ...profileData } = req.body;
        
        // Le fichier photo vient de req.file (multer)
        const photoFile = req.file; // <-- C'EST ICI QU'IL MANQUE
        
        console.log('Données reçues:');
        console.log('- nom:', nom);
        console.log('- prenom:', prenom);
        console.log('- email:', email);
        console.log('- password:', password ? 'Présent' : 'Manquant');
        console.log('- role:', role);
        console.log('- photoFile:', photoFile ? 'Présent' : 'Absent');

        // Validation du rôle
        const validRoles = ['0', '1', '2'];
        const userRole = role !== undefined ? role : '1'; // Par défaut Acheteur
        
        console.log('Rôle reçu:', role);
        console.log('Rôle utilisé:', userRole);

        if (!validRoles.includes(userRole)) {
            console.log('Rôle invalide:', userRole);
            return res.status(400).json({
                success: false,
                message: 'Rôle invalide. Doit être 0 (Admin), 1 (Acheteur) ou 2 (Boutique)'
            });
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email déjà utilisé'
            });
        }

        // Créer l'utilisateur
        const user = await User.create({
            nom,
            prenom,
            email,
            password,
            role: userRole // Ajoutez le rôle ici aussi si votre modèle le requiert
        });

        // Créer le profil correspondant au rôle
        const { profile, profileType } = await createProfileForUser(
            user, 
            parseInt(userRole), // Convertir en nombre
            profileData, 
            photoFile  // Passez le fichier ici
        );

        // Créer l'assignation de rôle
        const roleAssignmentData = {
            user: user._id,
            role: parseInt(userRole), // Convertir en nombre
            [profileType]: profile._id
        };

        const roleAssignment = await RoleAssignment.create(roleAssignmentData);

        // Générer le token
        const token = generateToken(user, parseInt(userRole), profile._id);

        // Préparer la réponse
        const response = {
            success: true,
            token,
            user: {
                id: user._id,
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                role: parseInt(userRole), // Convertir en nombre
                profileId: profile._id
            }
        };

        // Ajouter les infos du profil selon le type
        const numericRole = parseInt(userRole);
        if (numericRole === 2) {
            response.boutiqueInfo = {
                id: profile._id,
                name: profile.name,
                isValidated: profile.isValidated
            };
        } else if (numericRole === 1) {
            response.acheteurInfo = {
                id: profile._id,
                name: profile.name
            };
        } else if (numericRole === 0) {
            response.adminInfo = {
                id: profile._id,
                name: profile.name
            };
        }

        res.status(201).json(response);

    } catch (error) {
        console.error('Erreur détaillée lors de l\'inscription:', error);
        
        // Si erreur, nettoyer l'utilisateur créé
        if (req.body && req.body.email) {
            await User.findOneAndDelete({ email: req.body.email });
        }
        
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'inscription',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Connexion
exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Vérifier l'email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Identifiants invalides'
            });
        }

        // Vérifier le mot de passe
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Identifiants invalides'
            });
        }

        // Récupérer le rôle et le profil
        const roleAssignment = await RoleAssignment.findOne({ user: user._id })
            .populate('adminProfile')
            .populate('acheteurProfile')
            .populate('boutiqueProfile');

        if (!roleAssignment) {
            return res.status(401).json({
                success: false,
                message: 'Profil utilisateur non trouvé'
            });
        }

        // Récupérer le profil selon le rôle
        let profile = null;
        let profileId = null;
        let profileDetails = null;

        if (roleAssignment.role === 0 && roleAssignment.adminProfile) {
            profile = roleAssignment.adminProfile;
            profileDetails = await AdminProfile.findById(profile);
        } else if (roleAssignment.role === 1 && roleAssignment.acheteurProfile) {
            profile = roleAssignment.acheteurProfile;
            profileDetails = await AcheteurProfile.findById(profile);
        } else if (roleAssignment.role === 2 && roleAssignment.boutiqueProfile) {
            profile = roleAssignment.boutiqueProfile;
            profileDetails = await BoutiqueProfile.findById(profile);
        }

        if (!profile || !profileDetails) {
            return res.status(401).json({
                success: false,
                message: 'Profil non trouvé'
            });
        }

        // Vérifier si la boutique est validée (si applicable)
        if (roleAssignment.role === 2 && !profileDetails.isValidated) {
            return res.status(403).json({
                success: false,
                message: 'Votre boutique n\'est pas encore validée par l\'administrateur'
            });
        }

        if(role !== roleAssignment.role) {
            if(role == 0) {
                return res.status(403).json({
                    success: false,
                    message: 'Votre profil n\'est pas un admin'
                });
            } else if(role == 1) {
                return res.status(403).json({
                    success: false,
                    message: 'Votre profil n\'est pas un acheteur'
                });
            } else if(role == 2) {
                return res.status(403).json({
                    success: false,
                    message: 'Votre profil n\'est pas un boutique'
                });                
            }
        }

        profileId = profileDetails._id;

        // Générer le token
        const token = generateToken(user, roleAssignment.role, profileId);

        // Préparer la réponse
        const response = {
            success: true,
            token,
            user: {
                id: user._id,
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                role: roleAssignment.role,
                profileId: profileId
            }
        };

        // Ajouter les infos spécifiques au profil
        if (roleAssignment.role === 0) {
            response.adminInfo = {
                id: profileDetails._id,
                name: profileDetails.name
            };
        } else if (roleAssignment.role === 1) {
            response.acheteurInfo = {
                id: profileDetails._id,
                name: profileDetails.name,
                photo: profileDetails.photo
            };
        } else if (roleAssignment.role === 2) {
            response.boutiqueInfo = {
                id: profileDetails._id,
                name: profileDetails.name,
                address: profileDetails.address,
                phone: profileDetails.phone,
                isValidated: profileDetails.isValidated
            };
        }

        res.status(200).json(response);

    } catch (error) {
        console.log('Erreur login:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la connexion',
            error: error.message
        });
    }
};

// Récupérer l'utilisateur courant
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Récupérer le rôle et le profil
        const roleAssignment = await RoleAssignment.findOne({ user: user._id });

        if (!roleAssignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignation de rôle non trouvée'
            });
        }

        let profile = null;
        let profileDetails = null;

        // Récupérer les détails du profil selon le rôle
        if (roleAssignment.role === 0 && roleAssignment.adminProfile) {
            profileDetails = await AdminProfile.findById(roleAssignment.adminProfile);
        } else if (roleAssignment.role === 1 && roleAssignment.acheteurProfile) {
            profileDetails = await AcheteurProfile.findById(roleAssignment.acheteurProfile);
        } else if (roleAssignment.role === 2 && roleAssignment.boutiqueProfile) {
            profileDetails = await BoutiqueProfile.findById(roleAssignment.boutiqueProfile);
        }

        // Préparer la réponse
        const response = {
            success: true,
            user: {
                id: user._id,
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                role: roleAssignment.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        };

        // Ajouter les informations du profil
        if (profileDetails) {
            if (roleAssignment.role === 0) {
                response.profile = {
                    type: 'admin',
                    ...profileDetails.toObject()
                };
            } else if (roleAssignment.role === 1) {
                response.profile = {
                    type: 'acheteur',
                    ...profileDetails.toObject()
                };
            } else if (roleAssignment.role === 2) {
                response.profile = {
                    type: 'boutique',
                    ...profileDetails.toObject()
                };
            }
        }

        res.status(200).json(response);

    } catch (error) {
        console.error('Erreur getMe:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error.message
        });
    }
};

// Mettre à jour le profil
exports.updateProfile = async (req, res) => {
    try {
        const { nom, prenom, ...profileData } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Mettre à jour les informations de base de l'utilisateur
        if (nom) user.nom = nom;
        if (prenom) user.prenom = prenom;
        user.updatedAt = Date.now();
        await user.save();

        // Récupérer le rôle
        const roleAssignment = await RoleAssignment.findOne({ user: user._id });

        if (!roleAssignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignation de rôle non trouvée'
            });
        }

        // Mettre à jour le profil selon le rôle
        let updatedProfile = null;

        if (roleAssignment.role === 0 && roleAssignment.adminProfile) {
            updatedProfile = await AdminProfile.findByIdAndUpdate(
                roleAssignment.adminProfile,
                { ...profileData, updatedAt: Date.now() },
                { new: true, runValidators: true }
            );
        } else if (roleAssignment.role === 1 && roleAssignment.acheteurProfile) {
            updatedProfile = await AcheteurProfile.findByIdAndUpdate(
                roleAssignment.acheteurProfile,
                { ...profileData, updatedAt: Date.now() },
                { new: true, runValidators: true }
            );
        } else if (roleAssignment.role === 2 && roleAssignment.boutiqueProfile) {
            updatedProfile = await BoutiqueProfile.findByIdAndUpdate(
                roleAssignment.boutiqueProfile,
                { ...profileData, updatedAt: Date.now() },
                { new: true, runValidators: true }
            );
        }

        if (!updatedProfile) {
            return res.status(404).json({
                success: false,
                message: 'Profil non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profil mis à jour avec succès',
            profile: updatedProfile
        });

    } catch (error) {
        console.error('Erreur updateProfile:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du profil',
            error: error.message
        });
    }
};

// Déconnexion
exports.logout = (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Déconnexion réussie'
    });
};

// Changer le mot de passe
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Vérifier l'ancien mot de passe
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Mot de passe actuel incorrect'
            });
        }

        // Mettre à jour le mot de passe
        user.password = newPassword;
        user.updatedAt = Date.now();
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Mot de passe modifié avec succès'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors du changement de mot de passe',
            error: error.message
        });
    }
};