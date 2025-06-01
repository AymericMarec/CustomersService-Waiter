import { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Modal, View, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { styles } from '../styles/TakeCommand';
import { MenuItem,CartItem,Menu } from '../types/menu';

import { GetDishes ,API_URL} from '../lib/api';

export default function TakeCommandScreen() {
  const [selectedCategory, setSelectedCategory] = useState('Apéritifs');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [comments, setComments] = useState('');
  const [showItemModal, setShowItemModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [menu,setMenu] = useState<Menu | null>(null);
  const [tableNumber, setTableNumber] = useState('');

  const categories = ['Apéritifs', 'Boissons', 'Entrées', 'Plats', 'Desserts'];

  useEffect(() => {
    async function fetchData() {
      const menuItems:Menu = await GetDishes();
      setMenu(menuItems)
    }
    fetchData();
  }, []);

  const addToCart = () => {
    if (selectedItem) {
      const newItem: CartItem = {
        ...selectedItem,
        quantity,
        comments
      };
      setCart([...cart, newItem]);
      setShowItemModal(false);
      setQuantity(1);
      setComments('');
    }
  };

  const SendOrder = () => {
    if (!tableNumber) {
      alert('Veuillez saisir un numéro de table');
      return;
    }
    fetch(API_URL+'/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "tableNumber": parseInt(tableNumber),
            "order":cart
        })
    })
    setCart([]);
    setTableNumber('');
    setShowCartModal(false)
  }


  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText type="title">Le Petit Bistrot</ThemedText>
        <TouchableOpacity onPress={() => setShowCartModal(true)} style={styles.cartButton}>
          <Ionicons name="cart" size={24} color="#fff" />
          {cart.length > 0 && (
            <ThemedView style={styles.cartBadge}>
              <ThemedText style={styles.cartCount}>{cart.length}</ThemedText>
            </ThemedView>
          )}
        </TouchableOpacity>
      </ThemedView>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer} contentContainerStyle={styles.categoriesContent}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryPill,
              selectedCategory === category && styles.categoryPillActive
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <ThemedText style={[
              styles.categoryPillText,
              selectedCategory === category && styles.categoryPillTextActive
            ]}>{category}</ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Menu Items */}
      <ScrollView style={styles.menuContainer}>
        {(() => {
          if (!menu) return null;
          
          let categoryItems: MenuItem[] = [];
          switch (selectedCategory) {
            case 'Plats':
              categoryItems = menu.Dish;
              break;
            case 'Entrées':
              categoryItems = menu.Starter;
              break;
            case 'Desserts':
              categoryItems = menu.Dessert;
              break;
            case 'Boissons':
              categoryItems = menu.Drink;
              break;
            case 'Apéritifs':
              categoryItems = menu.Aperitif;
              break;
            default:
              categoryItems = [];
          }

          return categoryItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItemCard}
              onPress={() => {
                setSelectedItem(item);
                setShowItemModal(true);
              }}
            >
              <Image source={{ uri: API_URL+item.picture }} style={styles.menuItemImage} />
              <ThemedView style={styles.menuItemInfo}>
                <ThemedText style={styles.menuItemName}>{item.name}</ThemedText>
                <ThemedText style={styles.menuItemDescription}>{item.description}</ThemedText>
                <ThemedText style={styles.menuItemPrice}>{item.price} €</ThemedText>
              </ThemedView>
            </TouchableOpacity>
          ));
        })()}
      </ScrollView>

      {/* Item Details Modal */}
      <Modal
        visible={showItemModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowItemModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowItemModal(false)}
            >
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
            <ThemedText style={styles.modalTitle}>{selectedItem?.name}</ThemedText>
            <ThemedText style={styles.modalDescription}>{selectedItem?.description}</ThemedText>
            <ThemedText style={styles.modalPrice}>{selectedItem?.price} €</ThemedText>
            <View style={styles.quantityContainer}>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Ionicons name="remove-circle" size={28} color="#007AFF" />
              </TouchableOpacity>
              <ThemedText style={styles.quantityText}>{quantity}</ThemedText>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Ionicons name="add-circle" size={28} color="#007AFF" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.commentsInput}
              placeholder="Commentaires..."
              placeholderTextColor="#888"
              value={comments}
              onChangeText={setComments}
              multiline
            />
            <TouchableOpacity style={styles.addButton} onPress={addToCart}>
              <ThemedText style={styles.addButtonText}>Ajouter au panier</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Cart Modal */}
      <Modal
        visible={showCartModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCartModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowCartModal(false)}
            >
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
            <ThemedText style={styles.modalTitle}>Votre Commande</ThemedText>
            <TextInput
              style={styles.commentsInput}
              placeholder="Numéro de table..."
              placeholderTextColor="#888"
              value={tableNumber}
              onChangeText={setTableNumber}
              keyboardType="numeric"
            />
            <ScrollView style={styles.cartItems}>
              {cart.map((item, index) => (
                <View key={index} style={styles.cartItemRow}>
                  <View style={styles.cartItemInfo}>
                    <ThemedText style={styles.cartItemName}>{item.name}</ThemedText>
                    <ThemedText style={styles.cartItemQuantity}>x{item.quantity}</ThemedText>
                  </View>
                  <ThemedText style={styles.cartItemPrice}>{(item.price * item.quantity).toFixed(2)} €</ThemedText>
                  <TouchableOpacity onPress={() => removeFromCart(index)} style={styles.deleteButton}>
                    <MaterialCommunityIcons name="trash-can-outline" size={22} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <View style={styles.cartTotalRow}>
              <ThemedText style={styles.cartTotalText}>Total: {getTotal()} €</ThemedText>
            </View>
            <TouchableOpacity style={styles.confirmButton}>
              <ThemedText style={styles.confirmButtonText} onPress={SendOrder}>Confirmer la commande</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

