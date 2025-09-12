import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

const BorrowPage = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 30 }}>Inventory Management</Text>
      
      <View style={{ width: '100%', maxWidth: 400, gap: 10 }}>
        <Link href="/borrow/borrowItems" asChild>
          <TouchableOpacity style={{ 
            backgroundColor: '#4CAF50', 
            padding: 15, 
            borderRadius: 8,
            alignItems: 'center'
          }}>
            <Text style={{ color: 'white', fontWeight: '600' }}>Borrow Items</Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/borrow/returnItems" asChild>
          <TouchableOpacity style={{ 
            backgroundColor: '#2196F3', 
            padding: 15, 
            borderRadius: 8,
            alignItems: 'center'
          }}>
            <Text style={{ color: 'white', fontWeight: '600' }}>Return Items</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

export default BorrowPage;