export interface Produit {
image: any;
quantiteStock: any;
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