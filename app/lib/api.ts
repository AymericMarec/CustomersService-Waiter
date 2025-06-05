import Config from 'react-native-config';
import { Menu,MenuItem } from '../types/menu';

//impossible de récuperer une variable d'environement chargé
//c'est moins propre mais pas moins sécurisé , l'app est forcement privé
export const API_URL = "http://localhost:8000"

export async function GetDishes() {
    const response = await fetch(API_URL+"/api/foods")
    const data:MenuItem[] = await response.json()

    var dishes:Menu = {
        Dish:[],
        Starter:[],
        Dessert:[],
        Drink:[],
        Aperitif:[]
    }
    for (const item of data){
        const category = item.type as keyof Menu;
        dishes[category].push(item);
    }

    return dishes
}