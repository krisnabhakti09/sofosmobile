import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { addOrder, deleteOrder } from '../redux/orderSlice';
import { baseURL, myHeadersApiPublic } from '../service/index';

const CartScreen = ({ navigation, route, }) => {
  const [dataUser, setdatauser] = useState({})
  const [productItem, setproductItem] = useState({})
  const [alamat, setalamat] = useState("")
  const [kurir, setKuris] = useState({})
  const [ppn, setPpn] = useState(10000)
  const [catatan, setCatatan] = useState("")
  const [method, setmethod] = useState({})
  const [subtotal, setSubtotal] = useState(0)
  const [totals, setTotals] = useState(0)

  useEffect(() => {
    getDataUser()
    getData()
    setalamat(route.params.value.addresscustomer)
    setSubtotal(route.params.value.subtotal)
    setTotals(route.params.value.totals)
    setalamat(route.params.value.addresscustomer)
    setCatatan(route.params.value.pesan)
    setKuris(
      {
        "brand": route.params.value.delivery,
        "desc": route.params.value.deliverydesc,
        "price": route.params.value.pricedelivery
      },
    )
    setmethod(
      {
        "brand": route.params.value.pricemethod,
        "sn": route.params.value.pricemethodsn,
        "price": route.params.value.pricemethodadmin
      }
    )
  }, [])

  const getDataUser = async () => {
    try {
      const value = await AsyncStorage.getItem('@token')
      if (value != null) {
        let myHeadersApiPrivate = new Headers();
        myHeadersApiPrivate.append("Accept", "application/json");
        myHeadersApiPrivate.append("Authorization", `Bearer ${JSON.parse(value)}`);

        fetch(`${baseURL}/api/v1/users/profile/`, {
          method: "GET",
          headers: myHeadersApiPrivate,
        })
          .then(response => response.json())
          .then(response => {
            setdatauser(response.data)
          })
      }
    } catch (error) {
    }
  }


  const getData = async () => {
    const formData = {
      "id": route.params.value.idrobotproductpartdevice
    }
    fetch(`${baseURL}/api/v1/robotmaster/byid/`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: myHeadersApiPublic
    })
      .then(response => response.json())
      .then(res => {
        console.log(res)
        setproductItem(res.data)
      })
      .catch(err => {
        setLoading(false)
      })
  }


  return (
    <View style={{ flex: 1, marginTop: 22 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3114/3114883.png' }} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.title}>REVIEW CHECKOUT {route.params.kodeinvoice}</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.containerLocation}>
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2838/2838912.png' }} style={styles.icon} />
          <View style={{ marginLeft: 15, width: '90%' }}>
            <Text style={{ fontSize: 17, fontWeight: '500' }}>Alamat Pengiriman</Text>
            <Text>{dataUser.name} | {dataUser.number}</Text>
            <Text style={{
              width: "100%",
              borderBottomWidth: 1,
              borderBottomColor: "#aeaeae"
            }}>
              {alamat}
            </Text>
          </View>
        </View>
        <View style={styles.containerItem}>
          <View style={{ flexDirection: 'row', alignItems: 'center', width: '80%' }}>
            <Image source={{ uri: `${baseURL}/${productItem.image}` }} style={{ height: 45, width: 45, marginRight: 15 }} />
            <View style={{ maxWidth: '85%' }}>
              <Text numberOfLines={1} style={{ fontWeight: '500', color: "#000" }}>{productItem.name}</Text>
              {/* <Text numberOfLines={1} style={{ lineHeight: 25, fontSize: 11 }}>{productItem.description.slice(0, 80)}...</Text> */}
              <Text numberOfLines={1} style={{ fontWeight: '500' }}>Rp. {productItem.price}</Text>
            </View>
          </View>
        </View>
        <View style={styles.containerOpsi}>
          <View>
            <Text>Opsi pengiriman</Text>
            <Text style={{ lineHeight: 25, fontWeight: '600' }}>{kurir.brand}</Text>
            <Text>{kurir.desc}</Text>
          </View>
          <Text>RP. {kurir.price}   {">"}</Text>
        </View>
        <View style={styles.containerOpsi}>
          <Text>Catatan : </Text>

          <Text s style={{
            borderBottomWidth: 1,
            borderBottomColor: "#aeaeae",
            fontSize: 11
          }}>
            {catatan}
          </Text>
        </View>
        <View style={styles.containerOpsi}>
          <Text>Total pesanan ({productItem.length} produk) : </Text>
          <Text>Rp. {subtotal}</Text>
        </View>
        <View style={styles.containerOpsi}>
          <Text>Metode pembayaran</Text>
          <Text> {method.brand}-{method.sn}  {">"}</Text>
        </View>
        <View style={styles.containerOpsi}>
          <View>
            <Text style={{ marginBottom: 10 }}>Rincian pembayaran</Text>
            <Text style={{ fontSize: 12 }}>Subtotal produk</Text>
            <Text style={{ fontSize: 12 }}>Subtotal pengiriman</Text>
            <Text style={{ fontSize: 12 }}>Admin Pembayaran</Text>
            <Text style={{ fontSize: 12 }}>Ppp 11%</Text>
            <Text style={{ fontWeight: '600', marginTop: 10 }}>Total pembayaran</Text>
          </View>
          <View>
            <Text style={{ marginBottom: 10 }}></Text>
            <Text style={{ fontSize: 12 }}>Rp. {subtotal}</Text>
            <Text style={{ fontSize: 12 }}>Rp. {kurir.price}</Text>
            <Text style={{ fontSize: 12 }}>Rp. {method.price}</Text>
            <Text style={{ fontSize: 12 }}>Rp. {ppn}</Text>
            <Text style={{ fontWeight: '600', marginTop: 10 }}>Rp. {totals}</Text>
          </View>
        </View>
        <View style={{ height: 75 }} />
      </ScrollView >
      <View style={styles.containerCheckout}>
        <View style={{ width: '100%', backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'flex-end', padding: 20 }}>
          <Text style={{ fontWeight: '600', fontSize: 17 }}>Total Pembayaran</Text>
          <Text style={{ fontWeight: '600', fontSize: 17, color: '#9E579D' }}>Rp. {totals}</Text>
        </View>
      </View >

    </View >
  )
}

const styles = StyleSheet.create({
  container: {},
  header: { height: 50, backgroundColor: '#FFF', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, elevation: 3 },
  containerLocation: { padding: 20, flexDirection: 'row', backgroundColor: '#FFF', elevation: 3, marginTop: 3 },
  icon: { height: 24, width: 24 },
  containerItem: { flexDirection: 'row', padding: 20, backgroundColor: '#9E579D50', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  containerOpsi: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#FFF', marginTop: 5 },
  containerCheckout: { flexDirection: 'row', height: 70, position: 'absolute', bottom: 0 }
})


const mapStateToProps = (state, myOwnProps) => {
  return {
    orderslist: state.orders.orderslist,
  }
}

const mapDispatchToProps = {
  // ... normally is an object full of action creators
  addOrder,
  deleteOrder,
}

export default connect(mapStateToProps, mapDispatchToProps)(CartScreen);