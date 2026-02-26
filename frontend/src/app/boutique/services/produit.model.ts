export interface Produit {
  _id: string;
  nom: string;
  prix: number;
  id_boutique: {
    _id: string;
    nom: string;
    adresse: string;
  };
  idCategorie: {
    _id: string;
    nom: string;
    description: string;
  };
}