import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/ReadyCommand';

const CurrentOrders = [
  {
    id: '1',
    table: 12,
    dishes: ['Burger', 'Frites', 'Coca-Cola'],
  },
  {
    id: '2',
    table: 7,
    dishes: ['Pizza Margherita', 'Eau gazeuse'],
  },
  {
    id: '3',
    table: 3,
    dishes: ['Salade César', 'Jus d’orange'],
  },
];

export default function ReadyCommand() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Commandes prêtes</Text>
      {CurrentOrders.map((order) => (
        <View key={order.id} style={styles.card}>
          <View style={styles.header}>
            <Ionicons name="restaurant" size={28} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.tableNumber}>Table {order.table}</Text>
          </View>
          <View style={styles.dishesRow}>
            {order.dishes.map((dish, idx) => (
              <View key={idx} style={styles.chip}>
                <Text style={styles.chipText}>{dish}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.buttonText}>Valider la commande</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}
