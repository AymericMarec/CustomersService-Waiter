import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/ReadyCommand';
import { Order } from '../types/order';

export default function ReadyCommand() {
  const ws = useRef<WebSocket | null>(null);
  const [orders,setorders] = useState<Order[]>([])
  ws.current = new WebSocket('wss://exemple.com/socket');

  ws.current.onmessage = (message) => {
      const data = JSON.parse(message.data);
      setorders([...orders,data])
  };


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Commandes prêtes</Text>
      {orders.map((order) => (
        <View key={order.type} style={styles.card}>
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
