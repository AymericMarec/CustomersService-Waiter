import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/ReadyCommand';
import { Order } from '../types/order';

export default function ReadyCommand() {
  const ws = useRef<WebSocket | null>(null);
  const [orders,setorders] = useState<Order[]>([])
  ws.current = new WebSocket('ws://localhost:8765/ws');

  ws.current.onopen = () => {
    ws.current?.send(JSON.stringify({ type: 'register', role: 'waiter' }));
  };

  ws.current.onmessage = (message) => {
    const data = JSON.parse(message.data);
    data.order = JSON.parse(data.order);

    setorders(prevOrders => {
      const exists = prevOrders.some(order =>
        JSON.stringify(order.order) === JSON.stringify(data.order) &&
        order.tableNumber === data.tableNumber &&
        order.type === data.type
      );

      if (exists) {
        console.log('Commande déjà présente');
        return prevOrders;
      }

      return [...prevOrders, data];
    });
  };


  useEffect(() => {
  console.log('orders mis à jour :', orders);
}, [orders]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Commandes prêtes</Text>
      {orders.map((order) => (
        <View key={order.type} style={styles.card}>
          <View style={styles.header}>
            <Ionicons name="restaurant" size={28} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.tableNumber}>Table {order.tableNumber}</Text>
          </View>
          <View style={styles.dishesRow}>
            {order.order.map((dish, idx) => (
              <View key={idx} style={styles.chip}>
                <Text style={styles.chipText}>{dish.name} x {dish.quantity}</Text>
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
