import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, 
  SafeAreaView, StatusBar, TextInput, Alert,
  ImageBackground, Modal, useWindowDimensions, KeyboardAvoidingView, Platform,
  Animated // Tambahkan Animated
} from 'react-native';

export default function App() {
  const { width } = useWindowDimensions();
  const [currentScreen, setCurrentScreen] = useState('login'); 
  const [activeTab, setActiveTab] = useState('beranda'); 
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Transfer Bank');

  // ANIMASI FADE-IN PAGE
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [activeTab]);

  // ANIMASI PULSE UNTUK TRACKING
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (activeTab === 'tracking') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.5, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [activeTab]);

  // STATE UNTUK TRACKING REAL-TIME & RESI
  const [trackingInfo, setTrackingInfo] = useState({
    resi: 'BELUM ADA PESANAN',
    status: 0, // 0: Diterima, 1: Dikemas, 2: Menunggu Kurir, 3: Perjalanan
    timestamp: '--:--'
  });

  // LOGIC REAL-TIME TRACKING
  useEffect(() => {
    let interval;
    if (activeTab === 'tracking' && trackingInfo.status < 3) {
      interval = setInterval(() => {
        setTrackingInfo(prev => ({
          ...prev,
          status: prev.status + 1
        }));
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [activeTab, trackingInfo.status]);

  // STATE UNTUK CHAT
  const [chatVisible, setChatVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: "Halo Rocker! Ada yang bisa kami bantu hari ini? ", sender: 'bot', time: '10:00' }
  ]);
  const scrollViewRef = useRef();

  const isWeb = width > 768;
  const numColumns = isWeb ? 4 : 2;
  const cardMargin = isWeb ? 10 : 8;
  const horizontalPadding = isWeb ? 80 : 20; 
  const cardWidth = (width - horizontalPadding) / numColumns - (cardMargin * 2);

  const products = [
    { id: 1, artist: 'METALLICA', title: "Kill 'Em All", price: 450000, badge: 'Rilis 1983', rating: 4.8, reviews: 120, desc: "Album debut legendaris Thrash Metal.", img: require('./assets/Kill.jpg') },
    { id: 2, artist: 'METALLICA', title: 'Ride The Lightning', price: 475000, badge: 'Rilis 1984', rating: 4.9, reviews: 85, desc: "Eksplorasi musikalitas yang lebih dalam.", img: require('./assets/Ride.png') },
    { id: 3, artist: 'METALLICA', title: 'Master of Puppets', price: 500000, badge: 'Rilis 1986', rating: 5.0, reviews: 210, desc: "Sering dianggap sebagai album metal terbaik.", img: require('./assets/Master.jpg') },
    { id: 4, artist: 'NIRVANA', title: 'Bleach', price: 400000, badge: 'Rilis 1989', rating: 4.5, reviews: 64, desc: "Karya jujur dan mentah.", img: require('./assets/Bleach.jpg') },
    { id: 5, artist: 'NIRVANA', title: 'Nevermind', price: 550000, badge: 'Rilis 1991', rating: 5.0, reviews: 340, desc: "Album yang mengubah wajah musik dunia.", img: require('./assets/Nevermind.jpg') },
    { id: 6, artist: 'NIRVANA', title: 'In Utero', price: 525000, badge: 'Rilis 1993', rating: 4.7, reviews: 92, desc: "Album Absolut dari nirvana.", img: require('./assets/InUtero.jpg') },
    { id: 7, artist: 'GREEN DAY', title: 'Dookie', price: 380000, badge: 'Rilis 1994', rating: 4.8, reviews: 150, desc: "Ledakan Pop-Punk yang membawa punk ke arus utama.", img: require('./assets/Dookie.jpg') },
    { id: 8, artist: 'GREEN DAY', title: 'Insomniac', price: 390000, badge: 'Rilis 1995', rating: 4.4, reviews: 45, desc: "Sisi gelap dan keras era kesuksesan Green Day.", img: require('./assets/Insomniac.jpg') },
    { id: 9, artist: 'GREEN DAY', title: 'Nimrod', price: 410000, badge: 'Rilis 1997', rating: 4.6, reviews: 78, desc: "Eksperimen genre yang melahirkan hits akustik.", img: require('./assets/nimrod.jpg') },
  ];

  const handleGenrePress = (genre) => {
    setActiveTab('artikel');
    if (genre === 'THRASH METAL' || genre === 'METAL') {
      setSearch('Metallica');
    } else if (genre === 'GRUNGE') {
      setSearch('Nirvana');
    } else if (genre === 'PUNK') {
      setSearch('Green Day');
    }
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
    Alert.alert(' Rock On!', `${product.title} ditambahkan!`);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handlePayment = () => {
    const randomResi = "KR-" + Math.floor(10000 + Math.random() * 90000);
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setTrackingInfo({
      resi: randomResi,
      status: 0,
      timestamp: currentTime
    });

    Alert.alert(
      "PESANAN BERHASIL!", 
      `Jiwa pemberontakmu sedang kami siapkan.\nResi Anda: ${randomResi}`,
      [{ text: "LIHAT TRACKING", onPress: () => {
        setCart([]); 
        setActiveTab('tracking'); 
      }}]
    );
  };

  const sendMessage = () => {
    if (inputText.trim() === '') return;
    const newUserMsg = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    setTimeout(() => {
      const botMsg = {
        id: Date.now() + 1,
        text: "Pesan Anda telah kami terima. Tim support KeepRock akan segera merespons. Stay Loud! ",
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  const calculateTotal = () => cart.reduce((sum, item) => sum + item.price, 0);
  const shippingFee = cart.length > 0 ? 25000 : 0; 

  if (currentScreen === 'login') {
    return (
      <View style={styles.authContainer}>
        <ImageBackground source={require('./assets/back.jpg')} style={styles.fullBg} blurRadius={5}>
          <View style={styles.darkOverlayAuth}>
            <View style={[styles.glassBox, { width: isWeb ? 400 : '85%' }]}>
              <Text style={styles.authLogo}>KEEPROCK</Text>
              <Text style={styles.authSub}>THE ORIGINAL VYNIL YOU GET</Text>
              <TextInput style={styles.authInput} placeholder="Email" placeholderTextColor="#555" />
              <TextInput style={styles.authInput} placeholder="Password" placeholderTextColor="#555" secureTextEntry />
              <TouchableOpacity style={styles.authBtn} onPress={() => setCurrentScreen('shop')}>
                <Text style={styles.authBtnText}>ENTER</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setCurrentScreen('register')} style={{marginTop: 15}}>
                <Text style={{color: '#888', fontSize: 12}}>Don't have an account? <Text style={{color: '#EAB308', fontWeight: 'bold'}}>JOIN US</Text></Text>
              </TouchableOpacity>
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} /><Text style={styles.dividerText}>OR LOGIN WITH</Text><View style={styles.dividerLine} />
              </View>
              <View style={styles.socialContainer}>
                <TouchableOpacity style={styles.socialBtn}><Text style={{color: '#fff', fontWeight: 'bold'}}>G</Text></TouchableOpacity>
                <TouchableOpacity style={styles.socialBtn}><Text style={{color: '#fff', fontWeight: 'bold'}}>f</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }

  if (currentScreen === 'register') {
    return (
      <View style={styles.authContainer}>
        <ImageBackground source={require('./assets/back.jpg')} style={styles.fullBg} blurRadius={5}>
          <View style={styles.darkOverlayAuth}>
            <View style={[styles.glassBox, { width: isWeb ? 400 : '85%' }]}>
              <Text style={styles.authLogo}>JOIN</Text>
              <Text style={styles.authSub}>CREATE YOUR ROCKER IDENTITY</Text>
              <TextInput style={styles.authInput} placeholder="Full Name" placeholderTextColor="#555" />
              <TextInput style={styles.authInput} placeholder="Email Address" placeholderTextColor="#555" />
              <TextInput style={styles.authInput} placeholder="Password" placeholderTextColor="#555" secureTextEntry />
              <TextInput style={styles.authInput} placeholder="Confirm Password" placeholderTextColor="#555" secureTextEntry />
              <TouchableOpacity style={styles.authBtn} onPress={() => {
                Alert.alert("Success", "Account created! Please login.");
                setCurrentScreen('login');
              }}>
                <Text style={styles.authBtnText}>SIGN UP NOW</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setCurrentScreen('login')} style={{marginTop: 15}}>
                <Text style={{color: '#888', fontSize: 12}}>Already a member? <Text style={{color: '#EAB308', fontWeight: 'bold'}}>LOG IN</Text></Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTopText}>GREETINGS, ROCKER</Text>
          <Text style={styles.logo}>KEEPROCK</Text>
        </View>
        <TouchableOpacity onPress={() => setActiveTab('checkout')} style={styles.cartIconContainer}>
          <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{cart.length}</Text></View>
          <Text style={{fontSize: 24}}>🛒</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navbar}>
        {['BERANDA', 'KOLEKSI', 'CHECKOUT', 'TRACKING'].map((t) => (
          <TouchableOpacity 
            key={t} 
            onPress={() => {
                setActiveTab(t.toLowerCase() === 'koleksi' ? 'artikel' : t.toLowerCase());
                if(t.toLowerCase() !== 'koleksi') setSearch('');
            }} 
            style={styles.navItem}
          >
            <Text style={[styles.navText, (activeTab === (t.toLowerCase() === 'koleksi' ? 'artikel' : t.toLowerCase())) && styles.navTextActive]}>
              {t}
            </Text>
            {(activeTab === (t.toLowerCase() === 'koleksi' ? 'artikel' : t.toLowerCase())) && <View style={styles.navIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: horizontalPadding / 2 }}>
        {/* WRAP ISI KONTEN DENGAN ANIMATED.VIEW UNTUK FADE IN */}
        <Animated.View style={{ opacity: fadeAnim }}>
          
          {activeTab === 'beranda' && (
            <View style={styles.homeContent}>
               <ImageBackground source={require('./assets/back.jpg')} style={styles.heroSection} imageStyle={{ borderRadius: 20 }}>
                  <View style={styles.heroOverlay}>
                    <Text style={styles.heroTitle}>MUSIC NEVER DIE</Text>
                    <Text style={styles.heroSubText}>Koleksi vinyl Terlengkap.</Text>
                    <TouchableOpacity style={styles.heroBtn} onPress={() => setActiveTab('artikel')}>
                      <Text style={styles.heroBtnText}>GO TO COLLECTION</Text>
                    </TouchableOpacity>
                  </View>
               </ImageBackground>

               <Text style={styles.sectionHeading}>BEST SELLER</Text>
               <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                  {products.slice(0, 3).map((item) => (
                    <TouchableOpacity key={item.id} style={styles.trendingCard} onPress={() => { setSelectedProduct(item); setModalVisible(true); }}>
                      <Image source={item.img} style={styles.trendingImg} />
                      <Text style={styles.trendingTitle}>{item.title}</Text>
                      <View style={styles.ratingRow}>
                        <Text style={styles.starText}> {item.rating}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
               </ScrollView>

               <Text style={styles.sectionHeading}>SHOP BY GENRE</Text>
               <View style={styles.genreGrid}>
                  {['THRASH METAL', 'GRUNGE', 'PUNK', 'METAL'].map((genre, idx) => (
                    <TouchableOpacity 
                      key={idx} 
                      style={styles.genreBox}
                      onPress={() => handleGenrePress(genre)}
                    >
                      <Text style={styles.genreBoxText}>{genre}</Text>
                    </TouchableOpacity>
                  ))}
               </View>
               <View style={styles.newsBox}>
                  <Text style={styles.newsTag}>LATEST NEWS</Text>
                  <Text style={styles.newsTitle}>The Vinyl Revival: Why Analog Still Wins in 2025</Text>
                  <Text style={styles.newsDesc}>Exploring the deep warmth of physical records in a digital era...</Text>
               </View>
               <View style={styles.quoteBox}>
                  <Text style={styles.quoteText}>"Music is the only religion that delivers the goods."</Text>
                  <Text style={styles.quoteAuthor}>— Frank Zappa</Text>
               </View>
            </View>
          )}

          {activeTab === 'artikel' && (
            <View style={styles.shopContainer}>
              <TextInput 
                style={styles.searchField} 
                placeholder="Search band or album..." 
                placeholderTextColor="#555" 
                value={search}
                onChangeText={setSearch} 
              />
              <View style={styles.productGrid}>
                {products.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.artist.toLowerCase().includes(search.toLowerCase())).map((item) => (
                  <View key={item.id} style={[styles.productCard, { width: cardWidth, margin: cardMargin }]}>
                    <TouchableOpacity onPress={() => { setSelectedProduct(item); setModalVisible(true); }}>
                      <View style={styles.imgWrapper}>
                        <Image source={item.img} style={styles.productImg} resizeMode="cover" />
                        <View style={styles.itemBadge}><Text style={styles.itemBadgeText}>{item.badge}</Text></View>
                      </View>
                    </TouchableOpacity>
                    <View style={styles.cardContent}>
                      <Text style={styles.itemArtist}>{item.artist}</Text>
                      <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                      <Text style={styles.itemPrice}>Rp {item.price.toLocaleString('id-ID')}</Text>
                      <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(item)}>
                        <Text style={styles.addBtnText}>{isWeb ? 'ADD TO CART' : 'ADD'}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {activeTab === 'checkout' && (
            <View style={styles.checkoutPage}>
              <Text style={styles.checkoutHeader}>YOUR CRATE ({cart.length})</Text>
              {cart.length === 0 ? (
                <View style={styles.emptyCart}><Text style={{color: '#444'}}>The pit is empty.</Text></View>
              ) : (
                <View>
                  {cart.map((item, index) => (
                    <View key={index} style={styles.cartItem}>
                      <Image source={item.img} style={styles.cartImg} />
                      <View style={{flex: 1}}>
                        <Text style={styles.cartTitle}>{item.title}</Text>
                        <Text style={styles.cartPrice}>Rp {item.price.toLocaleString('id-ID')}</Text>
                      </View>
                      <TouchableOpacity onPress={() => removeFromCart(index)}>
                        <Text style={{color: '#ff4444', fontWeight: 'bold'}}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                  <View style={styles.checkoutSection}>
                    <Text style={styles.sectionHeadingSmall}>METODE PEMBAYARAN</Text>
                    {['Transfer Bank', 'Kartu Kredit', 'E-Wallet', 'COD'].map((method) => (
                      <TouchableOpacity key={method} onPress={() => setPaymentMethod(method)} style={styles.methodOption}>
                        <View style={[styles.radio, paymentMethod === method && styles.radioActive]} />
                        <Text style={styles.methodText}>{method}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={styles.totalBox}>
                    <View style={styles.rowBetween}><Text style={styles.summaryText}>Subtotal:</Text><Text style={styles.summaryText}>Rp {calculateTotal().toLocaleString('id-ID')}</Text></View>
                    <View style={styles.rowBetween}><Text style={styles.summaryText}>Estimasi Ongkir:</Text><Text style={styles.summaryText}>Rp {shippingFee.toLocaleString('id-ID')}</Text></View>
                    <Text style={styles.totalAmount}>Total: Rp {(calculateTotal() + shippingFee).toLocaleString('id-ID')}</Text>
                    <TouchableOpacity style={styles.payBtn} onPress={handlePayment}>
                      <Text style={styles.payBtnText}>BAYAR SEKARANG</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}

          {activeTab === 'tracking' && (
            <View style={styles.trackingPage}>
              <Text style={styles.checkoutHeader}>PELACAKAN PESANAN</Text>
              <View style={styles.trackCard}>
                <Text style={styles.trackId}>ORDER #{trackingInfo.resi}</Text>
                
                <View style={styles.trackStep}>
                  {/* PULSE DOT DITERIMA */}
                  <Animated.View style={[
                    trackingInfo.status === 0 ? styles.trackDotActive : (trackingInfo.status > 0 ? styles.trackDotActive : styles.trackDot),
                    trackingInfo.status === 0 && { transform: [{ scale: pulseAnim }] }
                  ]} />
                  <Text style={trackingInfo.status >= 0 ? styles.trackTextActive : styles.trackText}>
                    Pesanan Diterima ({trackingInfo.timestamp})
                  </Text>
                </View>

                <View style={styles.trackStep}>
                  {/* PULSE DOT DIKEMAS */}
                  <Animated.View style={[
                    trackingInfo.status === 1 ? styles.trackDotActive : (trackingInfo.status > 1 ? styles.trackDotActive : styles.trackDot),
                    trackingInfo.status === 1 && { transform: [{ scale: pulseAnim }] }
                  ]} />
                  <Text style={trackingInfo.status >= 1 ? styles.trackTextActive : styles.trackText}>
                    Sedang Dikemas {trackingInfo.status === 1 ? '(Proses...)' : ''}
                  </Text>
                </View>

                <View style={styles.trackStep}>
                  {/* PULSE DOT KURIR */}
                  <Animated.View style={[
                    trackingInfo.status === 2 ? styles.trackDotActive : (trackingInfo.status > 2 ? styles.trackDotActive : styles.trackDot),
                    trackingInfo.status === 2 && { transform: [{ scale: pulseAnim }] }
                  ]} />
                  <Text style={trackingInfo.status >= 2 ? styles.trackTextActive : styles.trackText}>
                    Menunggu Kurir {trackingInfo.status === 2 ? '(Mencari Driver...)' : ''}
                  </Text>
                </View>

                <View style={styles.trackStep}>
                  {/* PULSE DOT PERJALANAN */}
                  <Animated.View style={[
                    trackingInfo.status === 3 ? styles.trackDotActive : styles.trackDot,
                    trackingInfo.status === 3 && { transform: [{ scale: pulseAnim }] }
                  ]} />
                  <Text style={trackingInfo.status >= 3 ? styles.trackTextActive : styles.trackText}>
                    Dalam Perjalanan ⚡
                  </Text>
                </View>
              </View>
              <Text style={{color: '#444', fontSize: 10, marginTop: 15, textAlign: 'center'}}>
                Update status dilakukan secara real-time oleh sistem KeepRock.
              </Text>
            </View>
          )}

        </Animated.View>

        <View style={styles.footer}>
          <Text style={styles.footerLogo}>KEEPROCK.</Text>
          <Text style={styles.footerText}>Established 2025. For the loud and the proud.</Text>
          <View style={styles.footerLinks}>
            <Text style={styles.footerLinkItem}>Instagram</Text>
            <Text style={styles.footerLinkItem}>Twitter</Text>
            <Text style={styles.footerLinkItem}>Support</Text>
          </View>
          <Text style={styles.copyright}>© 2025 KEEPROCK ARCHIVE. STAY LOUD.</Text>
        </View>
        <View style={{height: 40}} />
      </ScrollView>

      {/* FLOATING CHAT BUTTON */}
      <TouchableOpacity style={styles.chatButton} onPress={() => setChatVisible(true)}>
        <Text style={{fontSize: 24}}>💬</Text>
      </TouchableOpacity>

      {/* MODAL ROOM CHAT */}
      <Modal visible={chatVisible} animationType="slide" transparent={false}>
        <SafeAreaView style={styles.chatRoomContainer}>
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={() => setChatVisible(false)}>
              <Text style={styles.backBtnChat}>←</Text>
            </TouchableOpacity>
            <View style={styles.chatHeaderInfo}>
              <View style={styles.botAvatar}>
                <Text style={{fontSize: 18}}>🤖</Text>
                <View style={styles.onlineStatus} />
              </View>
              <View>
                <Text style={styles.botName}>KeepRock Assistant</Text>
                <Text style={styles.botStatus}>Online</Text>
              </View>
            </View>
          </View>

          <ScrollView 
            style={styles.chatList}
            ref={scrollViewRef}
            onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
          >
            {messages.map((msg) => (
              <View key={msg.id} style={[styles.msgWrapper, msg.sender === 'user' ? styles.msgUserWrapper : styles.msgBotWrapper]}>
                <View style={[styles.msgBubble, msg.sender === 'user' ? styles.msgUserBubble : styles.msgBotBubble]}>
                  <Text style={[styles.msgText, msg.sender === 'user' ? styles.msgUserText : styles.msgBotText]}>{msg.text}</Text>
                  <Text style={styles.msgTime}>{msg.time}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.chatInputArea}>
            <TextInput 
              style={styles.chatInput} 
              placeholder="Tulis pesan..." 
              placeholderTextColor="#666"
              value={inputText}
              onChangeText={setInputText}
            />
            <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
              <Text style={{fontSize: 20}}>⚡</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      {/* MODAL PRODUCT DETAIL - REVISI ANIMATION TYPE KE FADE */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: isWeb ? 500 : '90%' }]}>
            <TouchableOpacity style={styles.modalClose} onPress={() => setModalVisible(false)}>
              <Text style={{color: '#fff', fontSize: 20}}>✕</Text>
            </TouchableOpacity>
            {selectedProduct && (
              <ScrollView>
                <Image source={selectedProduct.img} style={styles.detailImg} resizeMode="contain" />
                <Text style={styles.detailArtist}>{selectedProduct.artist}</Text>
                <Text style={styles.detailTitle}>{selectedProduct.title}</Text>
                <View style={styles.ratingBox}>
                  <Text style={styles.detailRating}> {selectedProduct.rating}</Text>
                  <Text style={styles.reviewCount}>({selectedProduct.reviews} Ulasan Pelanggan)</Text>
                </View>
                <Text style={styles.detailDesc}>{selectedProduct.desc}</Text>
                <Text style={styles.reviewHeader}>ULASAN TERBARU</Text>
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewerName}>Alex_Turner</Text>
                  <Text style={styles.reviewText}>"penjual sangat ramah"</Text>
                </View>
                <TouchableOpacity style={styles.modalAddBtn} onPress={() => { addToCart(selectedProduct); setModalVisible(false); }}>
                  <Text style={styles.modalAddBtnText}>BELI - Rp {selectedProduct.price.toLocaleString('id-ID')}</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  authContainer: { flex: 1 },
  fullBg: { width: '100%', height: '100%' },
  darkOverlayAuth: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  glassBox: { padding: 30, backgroundColor: '#0A0A0A', borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  authLogo: { color: '#EAB308', fontSize: 32, fontWeight: 'bold', letterSpacing: 4 },
  authSub: { color: '#555', fontSize: 10, marginBottom: 20 },
  authInput: { width: '100%', backgroundColor: '#000', color: '#fff', padding: 15, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: '#333' },
  authBtn: { backgroundColor: '#EAB308', width: '100%', padding: 15, borderRadius: 10, alignItems: 'center' },
  authBtnText: { fontWeight: 'bold', color: '#000' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#222' },
  dividerText: { color: '#444', fontSize: 10, marginHorizontal: 10 },
  socialContainer: { flexDirection: 'row', gap: 15 },
  socialBtn: { width: 45, height: 45, backgroundColor: '#111', borderRadius: 25, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#333' },

  header: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logo: { color: '#EAB308', fontSize: 24, fontWeight: 'bold' },
  headerTopText: { color: '#444', fontSize: 10 },
  cartIconContainer: { padding: 8, backgroundColor: '#111', borderRadius: 10 },
  cartBadge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#ff4444', borderRadius: 10, width: 18, height: 18, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  cartBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  navbar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#111', marginBottom: 15 },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 15 },
  navText: { color: '#444', fontSize: 11, fontWeight: 'bold' },
  navTextActive: { color: '#EAB308' },
  navIndicator: { width: 20, height: 2, backgroundColor: '#EAB308', marginTop: 4 },

  heroSection: { height: 180, marginVertical: 10, justifyContent: 'center' },
  heroOverlay: { backgroundColor: 'rgba(0,0,0,0.6)', flex: 1, padding: 20, justifyContent: 'center' },
  heroTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  heroSubText: { color: '#aaa', fontSize: 11, marginTop: 5 },
  heroBtn: { backgroundColor: '#EAB308', padding: 10, borderRadius: 5, marginTop: 15, alignSelf: 'flex-start' },
  heroBtnText: { fontWeight: 'bold', fontSize: 11 },

  sectionHeading: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginTop: 25, marginBottom: 15, letterSpacing: 1 },
  sectionHeadingSmall: { color: '#EAB308', fontSize: 12, fontWeight: 'bold', marginBottom: 10 },
  horizontalScroll: { flexDirection: 'row' },
  trendingCard: { marginRight: 15, width: 120 },
  trendingImg: { width: 120, height: 120, borderRadius: 10 },
  trendingTitle: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginTop: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  starText: { color: '#EAB308', fontSize: 10 },
  
  genreGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  genreBox: { flex: 1, minWidth: '45%', backgroundColor: '#111', padding: 15, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  genreBoxText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },

  newsBox: { backgroundColor: '#111', padding: 20, borderRadius: 15, marginTop: 25, borderWidth: 1, borderColor: '#222' },
  newsTag: { color: '#EAB308', fontSize: 10, fontWeight: 'bold', marginBottom: 5 },
  newsTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  newsDesc: { color: '#666', fontSize: 12, marginTop: 5 },

  shopContainer: { width: '100%' },
  searchField: { backgroundColor: '#111', color: '#fff', padding: 12, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#222' },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  productCard: { backgroundColor: '#0A0A0A', borderRadius: 15, overflow: 'hidden', borderWidth: 1, borderColor: '#1A1A1A' },
  imgWrapper: { width: '100%', aspectRatio: 1, overflow: 'hidden' },
  productImg: { width: '100%', height: '100%' },
  cardContent: { padding: 10 },
  itemBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: '#EAB308', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4 },
  itemBadgeText: { fontSize: 8, fontWeight: 'bold' },
  itemArtist: { color: '#EAB308', fontSize: 9, fontWeight: 'bold' },
  itemTitle: { color: '#fff', fontSize: 13, fontWeight: 'bold', marginVertical: 2 },
  itemPrice: { color: '#666', fontSize: 11, marginBottom: 8 },
  addBtn: { backgroundColor: '#fff', padding: 8, borderRadius: 6, alignItems: 'center' },
  addBtnText: { color: '#000', fontWeight: 'bold', fontSize: 10 },

  checkoutPage: { padding: 10 },
  checkoutHeader: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  cartItem: { flexDirection: 'row', backgroundColor: '#111', padding: 12, borderRadius: 12, marginBottom: 10, alignItems: 'center' },
  cartImg: { width: 50, height: 50, borderRadius: 6, marginRight: 12 },
  cartTitle: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  cartPrice: { color: '#EAB308', fontSize: 12 },
  checkoutSection: { marginVertical: 20, padding: 15, backgroundColor: '#0A0A0A', borderRadius: 12 },
  methodOption: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#444', marginRight: 10 },
  radioActive: { backgroundColor: '#EAB308', borderColor: '#EAB308' },
  methodText: { color: '#fff', fontSize: 13 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  summaryText: { color: '#888', fontSize: 13 },
  totalBox: { marginTop: 10, padding: 15, borderTopWidth: 1, borderColor: '#222' },
  totalAmount: { color: '#fff', fontSize: 20, fontWeight: 'bold', textAlign: 'right', marginTop: 10 },
  payBtn: { backgroundColor: '#EAB308', padding: 15, borderRadius: 10, marginTop: 15, alignItems: 'center' },
  payBtnText: { fontWeight: 'bold', color: '#000' },

  trackingPage: { padding: 10 },
  trackCard: { backgroundColor: '#111', padding: 20, borderRadius: 15, borderWidth: 1, borderColor: '#222' },
  trackId: { color: '#EAB308', fontWeight: 'bold', marginBottom: 20, fontSize: 16 },
  trackStep: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  trackDotActive: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#EAB308', marginRight: 15 },
  trackDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#444', marginRight: 15 },
  trackTextActive: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  trackText: { color: '#444', fontSize: 13 },

  footer: { marginTop: 40, alignItems: 'center', paddingBottom: 20 },
  footerLogo: { color: '#222', fontSize: 28, fontWeight: 'bold' },
  footerText: { color: '#444', fontSize: 10, marginTop: 5 },
  footerLinks: { flexDirection: 'row', gap: 20, marginTop: 15 },
  footerLinkItem: { color: '#666', fontSize: 11 },
  copyright: { color: '#333', fontSize: 9, marginTop: 20 },

  chatButton: { position: 'absolute', bottom: 30, right: 20, backgroundColor: '#EAB308', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  chatRoomContainer: { flex: 1, backgroundColor: '#000' },
  chatHeader: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#111' },
  backBtnChat: { color: '#EAB308', fontSize: 24, marginRight: 15 },
  chatHeaderInfo: { flexDirection: 'row', alignItems: 'center' },
  botAvatar: { width: 40, height: 40, backgroundColor: '#111', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  onlineStatus: { width: 10, height: 10, backgroundColor: '#22C55E', borderRadius: 5, position: 'absolute', bottom: 0, right: 0, borderWidth: 2, borderColor: '#000' },
  botName: { color: '#fff', fontWeight: 'bold' },
  botStatus: { color: '#22C55E', fontSize: 10 },
  chatList: { flex: 1, padding: 15 },
  msgWrapper: { marginBottom: 15, maxWidth: '80%' },
  msgUserWrapper: { alignSelf: 'flex-end' },
  msgBotWrapper: { alignSelf: 'flex-start' },
  msgBubble: { padding: 12, borderRadius: 15 },
  msgUserBubble: { backgroundColor: '#EAB308', borderBottomRightRadius: 2 },
  msgBotBubble: { backgroundColor: '#111', borderBottomLeftRadius: 2 },
  msgText: { fontSize: 14 },
  msgUserText: { color: '#000' },
  msgBotText: { color: '#fff' },
  msgTime: { fontSize: 8, color: '#666', marginTop: 5, alignSelf: 'flex-end' },
  chatInputArea: { flexDirection: 'row', padding: 15, alignItems: 'center' },
  chatInput: { flex: 1, backgroundColor: '#111', color: '#fff', padding: 12, borderRadius: 25, marginRight: 10 },
  sendBtn: { width: 45, height: 45, backgroundColor: '#EAB308', borderRadius: 22.5, justifyContent: 'center', alignItems: 'center' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#0A0A0A', borderRadius: 20, padding: 20, maxHeight: '85%', borderWidth: 1, borderColor: '#222' },
  modalClose: { alignSelf: 'flex-end', padding: 10 },
  detailImg: { width: '100%', height: 250, marginBottom: 20 },
  detailArtist: { color: '#EAB308', fontSize: 14, fontWeight: 'bold' },
  detailTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  ratingBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  detailRating: { color: '#EAB308', fontWeight: 'bold', marginRight: 10 },
  reviewCount: { color: '#555', fontSize: 12 },
  detailDesc: { color: '#888', lineHeight: 20, marginBottom: 25 },
  reviewHeader: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginBottom: 10 },
  reviewItem: { backgroundColor: '#111', padding: 12, borderRadius: 10, marginBottom: 20 },
  reviewerName: { color: '#EAB308', fontSize: 11, fontWeight: 'bold', marginBottom: 4 },
  reviewText: { color: '#aaa', fontSize: 12, fontStyle: 'italic' },
  modalAddBtn: { backgroundColor: '#EAB308', padding: 18, borderRadius: 12, alignItems: 'center' },
  modalAddBtnText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  quoteBox: { marginTop: 30, padding: 20, borderLeftWidth: 4, borderLeftColor: '#EAB308', backgroundColor: '#050505' },
  quoteText: { color: '#fff', fontSize: 16, fontStyle: 'italic' },
  quoteAuthor: { color: '#EAB308', fontSize: 12, marginTop: 10, fontWeight: 'bold' },
  emptyCart: { padding: 40, alignItems: 'center' },
});