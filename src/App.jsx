import React, { useState, useEffect, useMemo, createContext, useContext, useRef } from 'react';
import { 
  ShoppingBag, Search, Menu, X, Heart, Star, ChevronRight, ArrowRight, 
  Instagram, Facebook, Twitter, MapPin, Phone, Mail, Trash2, Plus, 
  Minus, ArrowLeft, Filter, CheckCircle, Eye, BookOpen, PenTool, 
  Link as LinkIcon, Image as ImageIcon, ExternalLink 
} from 'lucide-react';

// --- SOCIAL MEDIA LINKS (Updated) ---
const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/nomanaslam236", 
  facebook: "https://www.facebook.com/noman.aslam.961509",
  twitter: "https://twitter.com/your_handle"
};

// --- FIREBASE IMPORTS ---
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, addDoc, onSnapshot, query, doc 
} from 'firebase/firestore';
import { 
  getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged 
} from 'firebase/auth';

// --- FIREBASE SETUP ---
const firebaseConfig = typeof __firebase_config !== 'undefined' 
  ? JSON.parse(__firebase_config) 
  : {
      apiKey: "AIzaSyCnr9LRMFSiM_PoK9gtRYqcPVTSOAodqp0",
      authDomain: "lumiere-luxe.firebaseapp.com",
      projectId: "lumiere-luxe",
      storageBucket: "lumiere-luxe.firebasestorage.app",
      messagingSenderId: "808275735016",
      appId: "1:808275735016:web:b43fbd91201fcfd9ff345d",
      measurementId: "G-2N98XE77RP"
    };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'luxe-boutique-app';

// --- STYLING CONSTANTS ---
const COLORS = {
  primary: '#FDFBF7', 
  accent: '#D4AF37',  
  secondary: '#F8F1ED', 
  text: '#1A1A1A',    
  muted: '#717171'    
};

// --- MOCK DATA ---
const CATEGORIES = ['All', 'Handbags', 'Tote Bags', 'Shoulder Bags', 'Clutches', 'Crossbody Bags', 'Backpacks'];

const PRODUCTS = [
  {
    id: 1,
    name: "Seraphina Gold Chain Mini",
    category: "Handbags",
    price: 1250.00,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800",
    description: "Crafted from Italian calfskin leather, the Seraphina features a signature gold-tone chain and a structured silhouette perfect for evening galas.",
    details: ["100% Genuine Leather", "Gold-tone hardware", "Internal zip pocket", "Adjustable strap"],
    trending: true,
    bestSeller: true
  },
  {
    id: 2,
    name: "Aurelia Oversized Tote",
    category: "Tote Bags",
    price: 890.00,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=800",
    description: "The ultimate companion for the modern woman on the go. Spacious enough for a laptop while maintaining an elegant profile.",
    details: ["Suede lining", "Magnetic closure", "Reinforced handles", "Dust bag included"],
    trending: true,
    bestSeller: false
  },
  {
    id: 3,
    name: "Elara Suede Clutch",
    category: "Clutches",
    price: 450.00,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&q=80&w=800",
    description: "Minimalist design meets luxury texture. The Elara clutch is a versatile staple for any cocktail attire.",
    details: ["Soft suede finish", "Hidden magnetic clasp", "Satin interior", "Removable chain"],
    trending: false,
    bestSeller: true
  },
  {
    id: 4,
    name: "Nova Crossbody",
    category: "Crossbody Bags",
    price: 675.00,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&q=80&w=800",
    description: "Compact and chic. The Nova crossbody offers hands-free luxury with its pebbled leather and polished accents.",
    details: ["Pebbled leather", "Two compartments", "Signature logo", "Lightweight"],
    trending: false,
    bestSeller: false
  },
  {
    id: 5,
    name: "Vesta Shoulder Bag",
    category: "Shoulder Bags",
    price: 980.00,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800",
    description: "A timeless shoulder bag with a vintage-inspired aesthetic. Perfect for transitioning from day to night.",
    details: ["Structured flap", "Polished buckle", "Multiple pockets", "Premium stitching"],
    trending: true,
    bestSeller: false
  },
  {
    id: 6,
    name: "Luna Urban Backpack",
    category: "Backpacks",
    price: 720.00,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800",
    description: "Luxury meets utility. The Luna backpack is designed for the cosmopolitan traveler seeking comfort without compromising style.",
    details: ["Water-resistant finish", "Padded straps", "Laptop sleeve", "Secure back pocket"],
    trending: false,
    bestSeller: true
  },
  {
    id: 7,
    name: "Isla Mini Satchel",
    category: "Handbags",
    price: 590.00,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800",
    description: "The Isla Mini Satchel is a petite powerhouse. Featuring a top handle and a detachable strap.",
    details: ["Full-grain leather", "Brass feet", "Twill lining", "Embossed logo"],
    trending: true,
    bestSeller: false
  },
  {
    id: 8,
    name: "Cleo Velvet Pouch",
    category: "Clutches",
    price: 320.00,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&q=80&w=800",
    description: "Soft velvet with a sophisticated sheen. The Cleo pouch adds a touch of drama to any outfit.",
    details: ["Silk-velvet blend", "Drawstring closure", "Hand-stitched", "Gold tassels"],
    trending: false,
    bestSeller: true
  }
];

const INITIAL_BLOGS = [
  {
    id: 'initial-1',
    title: "The Evolution of the Handbag",
    description: "From utility to high-fashion status symbols, explore the rich history of women's bags through the centuries.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800",
    affiliateLink: "#",
    date: "October 12, 2023"
  },
  {
    id: 'initial-2',
    title: "Seasonal Styling: Autumn Palette",
    description: "How to pair our blush pink and beige collection with the earthy tones of the current season.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800",
    affiliateLink: "#",
    date: "November 05, 2023"
  }
];

// --- STATE MANAGEMENT AND HOOKS ---
const StoreContext = createContext();

export const useStore = () => useContext(StoreContext);

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('luxe_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('luxe_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [blogs, setBlogs] = useState(INITIAL_BLOGS);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    const initAuth = async () => {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        await signInWithCustomToken(auth, __initial_auth_token);
      } else {
        await signInAnonymously(auth);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const blogsCollection = collection(db, 'artifacts', appId, 'public', 'data', 'blogs');
    const unsubscribe = onSnapshot(blogsCollection, 
      (snapshot) => {
        const fetchedBlogs = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));
        const allBlogs = [...fetchedBlogs, ...INITIAL_BLOGS];
        setBlogs(allBlogs);
      },
      (error) => console.error("Firestore Error:", error)
    );
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    localStorage.setItem('luxe_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('luxe_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));
  
  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const isWishlisted = prev.find(item => item.id === product.id);
      if (isWishlisted) return prev.filter(item => item.id !== product.id);
      return [...prev, product];
    });
  };

  const addBlog = async (newBlog) => {
    if (!user) return;
    const blogData = {
      ...newBlog,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      createdAt: Date.now()
    };
    try {
      const blogsCollection = collection(db, 'artifacts', appId, 'public', 'data', 'blogs');
      await addDoc(blogsCollection, blogData);
    } catch (e) {
      console.error("Error adding blog: ", e);
    }
  };

  const navigateTo = (page, id = null) => {
    setCurrentPage(page);
    setSelectedProductId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <StoreContext.Provider value={{
      cart, wishlist, blogs, currentPage, selectedProductId, searchQuery, categoryFilter, user,
      setSearchQuery, setCategoryFilter, addToCart, removeFromCart, updateQuantity, 
      toggleWishlist, addBlog, navigateTo, cartCount, cartTotal, clearCart
    }}>
      {children}
    </StoreContext.Provider>
  );
};

// --- UI COMPONENTS ---

const Navbar = () => {
  const { navigateTo, cartCount, wishlist, currentPage } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItemClass = (page) => `
    relative py-2 transition-all duration-300 hover:text-amber-600 
    ${currentPage === page ? 'text-amber-600 font-semibold' : ''}
    after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] 
    after:bg-amber-600 after:transition-all after:duration-300 
    hover:after:w-full ${currentPage === page ? 'after:w-full' : ''}
  `;

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 px-6 py-4 
      ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-100 py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4 lg:hidden">
          <button onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className={`w-6 h-6 ${isScrolled || currentPage !== 'home' ? 'text-slate-800' : 'text-white'}`} />
          </button>
        </div>

        <div className={`hidden lg:flex items-center space-x-10 uppercase tracking-[0.2em] text-[10px] font-bold 
          ${isScrolled || currentPage !== 'home' ? 'text-slate-600' : 'text-white'}`}>
          <button onClick={() => navigateTo('home')} className={navItemClass('home')}>Home</button>
          <button onClick={() => navigateTo('shop')} className={navItemClass('shop')}>Shop</button>
          <button onClick={() => navigateTo('blog')} className={navItemClass('blog')}>Blog</button>
          <button onClick={() => navigateTo('about')} className={navItemClass('about')}>About</button>
        </div>

        <div 
          onClick={() => navigateTo('home')}
          className={`cursor-pointer text-2xl font-serif tracking-tight text-center transition-transform duration-500 hover:scale-105 
            lg:absolute lg:left-1/2 lg:-translate-x-1/2 
            ${isScrolled || currentPage !== 'home' ? 'text-slate-900' : 'text-white'}`}
        >
          <span className="font-light tracking-[0.25em] uppercase">Lumière</span>
          <span className={`block text-[9px] tracking-[0.6em] -mt-1 uppercase font-bold 
            ${isScrolled || currentPage !== 'home' ? 'text-amber-600' : 'text-amber-400'}`}>Luxe Boutique</span>
        </div>

        <div className={`flex items-center space-x-6 ${isScrolled || currentPage !== 'home' ? 'text-slate-800' : 'text-white'}`}>
          <button onClick={() => navigateTo('shop')} className="hidden sm:block hover:text-amber-600 transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button onClick={() => navigateTo('wishlist')} className="relative hover:text-amber-600 transition-colors">
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-600 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pulse">
                {wishlist.length}
              </span>
            )}
          </button>
          <button onClick={() => navigateTo('cart')} className="relative hover:text-amber-600 transition-colors">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-[60] flex flex-col p-10 animate-in fade-in slide-in-from-left duration-300">
          <button onClick={() => setIsMobileMenuOpen(false)} className="self-end mb-16 hover:rotate-90 transition-transform">
            <X className="w-8 h-8 text-slate-800" />
          </button>
          <div className="flex flex-col space-y-10 text-3xl font-serif text-slate-900">
            <button className="text-left" onClick={() => { navigateTo('home'); setIsMobileMenuOpen(false); }}>Home</button>
            <button className="text-left" onClick={() => { navigateTo('shop'); setIsMobileMenuOpen(false); }}>Shop</button>
            <button className="text-left" onClick={() => { navigateTo('blog'); setIsMobileMenuOpen(false); }}>Fashion Blog</button>
            <button className="text-left" onClick={() => { navigateTo('about'); setIsMobileMenuOpen(false); }}>Our Story</button>
            <button className="text-left" onClick={() => { navigateTo('contact'); setIsMobileMenuOpen(false); }}>Contact Us</button>
          </div>
          <div className="mt-auto border-t border-slate-100 pt-10">
            <div className="flex space-x-6">
               <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer"><Instagram className="w-5 h-5 text-slate-400 hover:text-amber-600 transition-colors" /></a>
               <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer"><Facebook className="w-5 h-5 text-slate-400 hover:text-blue-600 transition-colors" /></a>
               <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer"><Twitter className="w-5 h-5 text-slate-400 hover:text-blue-400 transition-colors" /></a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const ProductCard = ({ product }) => {
  const { navigateTo, toggleWishlist, wishlist, addToCart } = useStore();
  const isWishlisted = wishlist.find(item => item.id === product.id);

  return (
    <div className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-100 rounded-sm cursor-pointer" onClick={() => navigateTo('product', product.id)}>
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          onError={(e) => { e.target.src = "https://via.placeholder.com/800x1000?text=Premium+Bag"; }}
        />
        <div className="absolute top-4 right-4 flex flex-col space-y-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
          <button 
            onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
            className={`p-2 rounded-full shadow-lg ${isWishlisted ? 'bg-amber-600 text-white' : 'bg-white text-slate-900'} hover:scale-110 transition`}
          >
            <Heart className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); navigateTo('product', product.id); }}
            className="p-2 bg-white text-slate-900 rounded-full shadow-lg hover:scale-110 transition"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
        
        {product.trending && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-[9px] font-bold tracking-widest uppercase text-slate-900">
            Trending
          </div>
        )}
        
        <button 
          onClick={(e) => { e.stopPropagation(); addToCart(product); }}
          className="absolute bottom-0 left-0 w-full bg-slate-900 text-white py-4 text-xs font-bold uppercase tracking-[0.25em] translate-y-full group-hover:translate-y-0 transition-transform duration-500"
        >
          Add to Bag
        </button>
      </div>
      <div className="mt-5 flex justify-between items-start">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1 font-bold">{product.category}</p>
          <h3 className="text-sm font-serif text-slate-900 leading-tight group-hover:text-amber-600 transition-colors">{product.name}</h3>
        </div>
        <p className="text-sm font-medium text-slate-900 tracking-tight">${product.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
      </div>
    </div>
  );
};

const BlogCard = ({ blog }) => {
  return (
    <div className="group flex flex-col h-full bg-white border border-slate-100 rounded-sm overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover transition duration-1000 group-hover:scale-110" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
      </div>
      <div className="p-8 flex flex-col flex-grow">
        <span className="text-[9px] font-bold text-amber-600 uppercase tracking-[0.3em] mb-3">{blog.date}</span>
        <h3 className="text-xl font-serif text-slate-900 mb-4 group-hover:text-amber-600 transition-colors leading-snug">{blog.title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow line-clamp-3">{blog.description}</p>
        <a 
          href={blog.affiliateLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900 group-hover:text-amber-600 transition-colors"
        >
          Read Story <ExternalLink className="w-3 h-3 ml-2" />
        </a>
      </div>
    </div>
  );
};

const Footer = () => {
  const { navigateTo } = useStore();
  return (
    <footer className="bg-slate-900 text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 border-b border-white/5 pb-20">
        <div className="space-y-8">
          <div className="text-2xl font-serif tracking-tight">
            <span className="font-light tracking-[0.2em] uppercase">Lumière</span>
            <span className="block text-[10px] tracking-[0.5em] text-amber-500 -mt-1 uppercase font-bold">Luxe Boutique</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            Refining the art of luxury leather since 1994. Hand-stitched elegance for the modern woman.
          </p>
          <div className="flex space-x-6">
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer"><Instagram className="w-5 h-5 text-slate-500 hover:text-white cursor-pointer transition-colors" /></a>
            <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer"><Facebook className="w-5 h-5 text-slate-500 hover:text-white cursor-pointer transition-colors" /></a>
            <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer"><Twitter className="w-5 h-5 text-slate-500 hover:text-white cursor-pointer transition-colors" /></a>
          </div>
        </div>
        
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-10 text-amber-500">Shop Collection</h4>
          <ul className="space-y-5 text-sm text-slate-400 font-medium">
            <li><button onClick={() => navigateTo('shop')} className="hover:text-white transition-colors">All Pieces</button></li>
            <li><button onClick={() => navigateTo('shop')} className="hover:text-white transition-colors">New Arrivals</button></li>
            <li><button onClick={() => navigateTo('shop')} className="hover:text-white transition-colors">Limited Edition</button></li>
            <li><button onClick={() => navigateTo('blog')} className="hover:text-white transition-colors">Atelier Blog</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-10 text-amber-500">Maison Lumière</h4>
          <ul className="space-y-5 text-sm text-slate-400 font-medium">
            <li><button onClick={() => navigateTo('about')} className="hover:text-white transition-colors">Our Heritage</button></li>
            <li><button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors">Concierge</button></li>
            <li><button className="hover:text-white transition-colors">Store Locator</button></li>
            <li><button className="hover:text-white transition-colors">Privacy Policy</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-10 text-amber-500">Newsletter</h4>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">Subscribe for private invitations to collection previews.</p>
          <div className="flex border-b border-white/20 pb-2">
            <input 
              type="email" 
              placeholder="Email address" 
              className="bg-transparent pb-1 flex-grow text-sm focus:outline-none placeholder:text-slate-600"
            />
            <button className="ml-2 hover:text-amber-500 transition-colors">
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-12 flex flex-col md:flex-row justify-between items-center text-slate-500 text-[10px] uppercase tracking-[0.3em]">
        <p>© {new Date().getFullYear()} Lumière Luxe International.</p>
        <div className="flex space-x-8 mt-4 md:mt-0">
          <span>Sustainability</span>
          <span>Careers</span>
          <span>Cookie Policy</span>
        </div>
      </div>
    </footer>
  );
};

// --- PAGE COMPONENTS ---

const HomePage = () => {
  const { navigateTo } = useStore();
  const featured = PRODUCTS.filter(p => p.trending).slice(0, 4);
  const bestSellers = PRODUCTS.filter(p => p.bestSeller).slice(0, 4);

  return (
    <div className="animate-in fade-in duration-1000">
      <section className="relative h-screen w-full flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
            alt="Luxury Fashion Background"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-white">
          <div className="max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] mb-6 animate-in slide-in-from-bottom duration-700 delay-100">Exquisite Craftsmanship</p>
            <h1 className="text-6xl md:text-8xl font-serif mb-10 leading-[1.1] animate-in slide-in-from-bottom duration-700 delay-200">
              The <span className="italic text-amber-400">Spring</span> <br /> 2024 Edit
            </h1>
            <p className="text-lg text-white/70 mb-12 max-w-xl leading-relaxed font-light animate-in slide-in-from-bottom duration-700 delay-300">
              Introducing a symphony of Italian leather and contemporary architecture. Handcrafted for the woman who defines her own elegance.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8 animate-in slide-in-from-bottom duration-700 delay-400">
              <button 
                onClick={() => navigateTo('shop')}
                className="bg-white text-slate-900 px-10 py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-amber-600 hover:text-white transition-all duration-500 shadow-xl"
              >
                Shop Collection
              </button>
              <button 
                onClick={() => navigateTo('about')}
                className="group flex items-center text-white text-[10px] font-bold uppercase tracking-[0.3em]"
              >
                Our Heritage 
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <span className="text-[8px] uppercase tracking-[0.5em] text-white/50 mb-4 font-bold">Scroll Down</span>
          <div className="w-[1px] h-20 bg-white/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-amber-500 animate-scroll-line"></div>
          </div>
        </div>
      </section>

      <section className="py-32 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-20">
          <div className="text-center md:text-left mb-8 md:mb-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-amber-600 mb-4">New Arrivals</p>
            <h2 className="text-4xl font-serif">Seasonal Curations</h2>
          </div>
          <button onClick={() => navigateTo('shop')} className="text-[10px] font-bold uppercase tracking-[0.3em] border-b border-slate-900 pb-2 hover:text-amber-600 hover:border-amber-600 transition-all">
            View All Pieces
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {featured.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="bg-[#F8F1ED] py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-sm shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=1200" 
                alt="Limited Edition Collection"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 border-[30px] border-white/50 -z-10"></div>
          </div>
          <div className="lg:pl-10">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] text-amber-600 mb-8 font-serif">Limited Series</h3>
            <h2 className="text-5xl font-serif mb-10 leading-tight">Sculpted <br /> <span className="italic text-amber-600">Silhouettes</span></h2>
            <p className="text-slate-500 leading-relaxed mb-12 text-lg font-light">
              "True luxury does not shout. It is the perfect balance of form and function." Discover the Vesta series—structured shoulder bags designed for effortless transitions.
            </p>
            <button 
              onClick={() => navigateTo('product', 5)}
              className="bg-slate-900 text-white px-12 py-6 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-amber-600 transition-all duration-500"
            >
              Explore the Series
            </button>
          </div>
        </div>
      </section>

      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group relative h-[600px] cursor-pointer overflow-hidden" onClick={() => navigateTo('shop')}>
                 <img src="https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Handbags"/>
                 <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:opacity-40"></div>
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <h3 className="text-3xl font-serif mb-4">Handbags</h3>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] border-b border-white pb-1">Shop Category</span>
                 </div>
              </div>
              <div className="group relative h-[600px] cursor-pointer overflow-hidden md:translate-y-16" onClick={() => navigateTo('shop')}>
                 <img src="https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Clutches"/>
                 <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:opacity-40"></div>
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <h3 className="text-3xl font-serif mb-4">Clutches</h3>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] border-b border-white pb-1">Shop Category</span>
                 </div>
              </div>
              <div className="group relative h-[600px] cursor-pointer overflow-hidden" onClick={() => navigateTo('shop')}>
                 <img src="https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Totes"/>
                 <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:opacity-40"></div>
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <h3 className="text-3xl font-serif mb-4">Totes</h3>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] border-b border-white pb-1">Shop Category</span>
                 </div>
              </div>
            </div>
        </div>
      </section>

      <section className="py-32 max-w-7xl mx-auto px-6 border-t border-slate-100">
        <div className="text-center mb-24">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-400 mb-4">Maison Favorites</p>
          <h2 className="text-4xl font-serif">Beloved Classics</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {bestSellers.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </div>
  );
};

const BlogPage = () => {
  const { blogs, navigateTo } = useStore();
  return (
    <div className="pt-40 pb-32 px-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-10">
        <div className="text-center md:text-left">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-amber-600 mb-6">Maison Insights</p>
          <h1 className="text-5xl font-serif mb-4 leading-tight">The Atelier <span className="italic">Blog</span></h1>
          <p className="text-slate-400 text-sm tracking-widest uppercase font-medium">Stories of craftsmanship, heritage, and style</p>
        </div>
        <button 
          onClick={() => navigateTo('write-blog')}
          className="flex items-center bg-slate-900 text-white px-10 py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-amber-600 transition-all duration-500"
        >
          <PenTool className="w-4 h-4 mr-3" /> Share a Story
        </button>
      </div>
      {blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {blogs.map(blog => <BlogCard key={blog.id} blog={blog} />)}
        </div>
      ) : (
        <div className="py-40 text-center border border-dashed rounded-sm border-slate-200">
          <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-8" />
          <p className="text-slate-400 italic text-xl font-serif">No stories found. Be the first to contribute.</p>
        </div>
      )}
    </div>
  );
};

const WriteBlogPage = () => {
  const { addBlog, navigateTo } = useStore();
  const fileInputRef = useRef();
  const [formData, setFormData] = useState({
    title: '', description: '', affiliateLink: '', imageType: 'url', image: ''
  });
  const [isPublishing, setIsPublishing] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, image: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.image) return;
    setIsPublishing(true);
    await addBlog({ ...formData, affiliateLink: formData.affiliateLink || '#' });
    setIsPublishing(false);
    navigateTo('blog');
  };

  return (
    <div className="pt-40 pb-32 max-w-4xl mx-auto px-6 animate-in fade-in duration-500">
      <button onClick={() => navigateTo('blog')} className="mb-12 flex items-center text-[10px] font-bold uppercase tracking-[0.3em] hover:text-amber-600 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Journal
      </button>
      <div className="bg-white border border-slate-100 p-12 md:p-20 rounded-sm shadow-2xl">
        <div className="mb-16 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-amber-600 mb-6">Contribute</p>
          <h1 className="text-4xl font-serif italic">Share Your Fashion Story</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-12">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 block mb-4">Article Title</label>
            <input required type="text" placeholder="e.g., The Art of the Mini Bag..." className="w-full border-b border-slate-200 py-4 focus:outline-none focus:border-amber-500 text-2xl font-serif placeholder:italic" value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 block mb-4">Content</label>
            <textarea required rows="8" placeholder="Tell your story here..." className="w-full border border-slate-100 bg-[#FDFBF7] p-8 focus:outline-none focus:border-amber-500 text-sm leading-loose font-light" value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} />
          </div>
          <div className="space-y-6">
            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 block">Cover Media</label>
            <div className="flex flex-wrap gap-4 mb-6">
              <button type="button" onClick={() => setFormData(prev => ({ ...prev, imageType: 'url' }))} className={`flex items-center px-6 py-3 text-[9px] font-bold uppercase tracking-[0.2em] transition-all rounded-sm ${formData.imageType === 'url' ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-500'}`}> <LinkIcon className="w-3 h-3 mr-3" /> Image URL </button>
              <button type="button" onClick={() => setFormData(prev => ({ ...prev, imageType: 'file' }))} className={`flex items-center px-6 py-3 text-[9px] font-bold uppercase tracking-[0.2em] transition-all rounded-sm ${formData.imageType === 'file' ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-500'}`}> <ImageIcon className="w-3 h-3 mr-3" /> From Gallery </button>
            </div>
            {formData.imageType === 'url' ? (
              <input type="url" placeholder="Paste high-quality image URL (https://...)" className="w-full border-b border-slate-200 py-4 focus:outline-none focus:border-amber-500 text-sm italic font-light" value={formData.image} onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))} />
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-6 p-8 border-2 border-dashed border-slate-100 bg-[#FDFBF7]">
                <button type="button" onClick={() => fileInputRef.current.click()} className="px-10 py-4 border border-slate-200 bg-white text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-slate-50 transition-all"> Choose File </button>
                <input type="file" ref={fileInputRef} accept="image/*" hidden onChange={handleFileChange} />
                {formData.image ? <span className="text-amber-600 text-[10px] font-bold flex items-center animate-pulse"><CheckCircle className="w-4 h-4 mr-2" /> Media Ready</span> : <span className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em]">Supported formats: JPG, PNG, WEBP</span>}
              </div>
            )}
          </div>
          <button type="submit" disabled={isPublishing} className="w-full bg-slate-900 text-white py-6 text-[10px] font-bold uppercase tracking-[0.5em] hover:bg-amber-600 transition-all duration-500 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"> {isPublishing ? 'Publishing Globally...' : 'Publish Article'} </button>
        </form>
      </div>
    </div>
  );
};

const ShopPage = () => {
  const { categoryFilter, setCategoryFilter, searchQuery, setSearchQuery, navigateTo } = useStore();
  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="pt-40 pb-32 px-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="mb-24 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-amber-600 mb-6">Collections</p>
        <h1 className="text-6xl font-serif leading-tight">Maison <span className="italic">Boutique</span></h1>
        <p className="text-slate-400 text-sm tracking-[0.2em] uppercase font-light mt-4">Exploring the pinnacle of accessory design</p>
      </div>
      <div className="flex flex-col lg:flex-row gap-20">
        <aside className="w-full lg:w-72 space-y-16">
          <div className="bg-[#FDFBF7] p-10 rounded-sm border border-slate-100">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 flex items-center text-slate-900"> <Search className="w-4 h-4 mr-3 text-amber-600" /> Search Maison </h4>
            <div className="relative">
              <input type="text" placeholder="Product name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-transparent border-b border-slate-200 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors font-light italic" />
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-10 flex items-center text-slate-900"> <Filter className="w-4 h-4 mr-3 text-amber-600" /> Categories </h4>
            <div className="space-y-5">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCategoryFilter(cat)} className={`group flex items-center text-xs tracking-[0.2em] uppercase transition-all duration-300 ${categoryFilter === cat ? 'text-amber-600 font-bold ml-2' : 'text-slate-500 hover:text-slate-900 hover:ml-2'}`}>
                  <span className={`w-1 h-1 bg-amber-600 rounded-full mr-3 transition-transform ${categoryFilter === cat ? 'scale-150' : 'scale-0 group-hover:scale-100'}`}></span>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>
        <main className="flex-grow">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-12">
              {filteredProducts.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="py-40 text-center bg-[#FDFBF7] rounded-sm border border-dashed border-slate-200">
              <p className="text-slate-400 font-serif italic text-xl mb-10">No matches found for your current filters.</p>
              <button onClick={() => {setSearchQuery(''); setCategoryFilter('All');}} className="text-[10px] font-bold uppercase tracking-[0.3em] border-b-2 border-slate-900 pb-2 hover:text-amber-600 hover:border-amber-600 transition-all">Reset All Filters</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const ProductPage = () => {
  const { selectedProductId, addToCart, navigateTo, toggleWishlist, wishlist } = useStore();
  const [qty, setQty] = useState(1);
  const product = PRODUCTS.find(p => p.id === selectedProductId);
  const isWishlisted = wishlist.find(item => item.id === product?.id);
  if (!product) return <div className="pt-40 text-center font-serif italic text-2xl">Searching Maison Archives...</div>;
  return (
    <div className="pt-40 pb-32 max-w-7xl mx-auto px-6 animate-in fade-in duration-700">
      <button onClick={() => navigateTo('shop')} className="mb-16 flex items-center text-[10px] font-bold uppercase tracking-[0.3em] hover:text-amber-600 transition-all"> <ArrowLeft className="w-4 h-4 mr-3" /> Back to Boutique </button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
        <div className="aspect-[4/5] bg-[#FDFBF7] overflow-hidden rounded-sm shadow-2xl group">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" />
        </div>
        <div className="flex flex-col py-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-amber-600 mb-6">{product.category}</p>
          <h1 className="text-5xl font-serif mb-8 leading-tight">{product.name}</h1>
          <p className="text-3xl font-light text-slate-900 mb-10 tracking-tighter">${product.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
          <div className="w-20 h-[1px] bg-amber-600 mb-10"></div>
          <p className="text-slate-500 leading-loose mb-12 text-lg font-light">{product.description}</p>
          <div className="mb-12 flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8">
            <div className="flex items-center border border-slate-200 bg-[#FDFBF7]">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-6 py-5 hover:bg-slate-50 transition-colors"><Minus className="w-3 h-3" /></button>
              <span className="px-10 text-sm font-bold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-6 py-5 hover:bg-slate-50 transition-colors"><Plus className="w-3 h-3" /></button>
            </div>
            <button onClick={() => addToCart(product, qty)} className="w-full flex-grow bg-slate-900 text-white py-6 px-12 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-amber-600 transition-all duration-500 shadow-2xl"> Add to Bag </button>
          </div>
          <button onClick={() => toggleWishlist(product)} className="flex items-center justify-center space-x-3 text-[10px] font-bold uppercase tracking-[0.3em] py-5 border border-slate-200 hover:bg-slate-50 transition-all"> <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-amber-600 text-amber-600 animate-pulse' : ''}`} /> <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span> </button>
        </div>
      </div>
    </div>
  );
};

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, navigateTo } = useStore();
  return (
    <div className="pt-40 pb-32 max-w-7xl mx-auto px-6 animate-in fade-in duration-500">
      <h1 className="text-5xl font-serif mb-20 italic">Shopping Bag</h1>
      {cart.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-24">
          <div className="flex-grow divide-y divide-slate-100">
            {cart.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-8 py-12 items-center group">
                <div className="col-span-12 md:col-span-6 flex items-center space-x-10">
                  <div className="w-32 h-40 overflow-hidden rounded-sm shadow-lg flex-shrink-0 cursor-pointer" onClick={() => navigateTo('product', item.id)}>
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-amber-600 mb-2">{item.category}</p>
                    <h4 className="font-serif text-2xl leading-tight mb-4 group-hover:text-amber-600 transition-colors cursor-pointer" onClick={() => navigateTo('product', item.id)}>{item.name}</h4>
                    <button onClick={() => removeFromCart(item.id)} className="text-[9px] font-bold uppercase tracking-[0.3em] text-red-400 hover:text-red-600 transition-colors flex items-center"> <Trash2 className="w-3 h-3 mr-2" /> Remove </button>
                  </div>
                </div>
                <div className="col-span-4 md:col-span-2 text-center text-sm font-medium tracking-tighter">${item.price.toFixed(2)}</div>
                <div className="col-span-4 md:col-span-2 flex justify-center">
                  <div className="flex items-center border border-slate-200 bg-[#FDFBF7]">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-3 hover:bg-slate-50 transition-colors"><Minus className="w-2 h-2" /></button>
                    <span className="px-4 text-[10px] font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-3 hover:bg-slate-50 transition-colors"><Plus className="w-2 h-2" /></button>
                  </div>
                </div>
                <div className="col-span-4 md:col-span-2 text-right font-bold tracking-tighter">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
          <div className="w-full lg:w-96">
            <div className="bg-[#FDFBF7] p-12 rounded-sm border border-slate-100 sticky top-40 shadow-xl">
              <h3 className="text-xl font-serif mb-10 border-b border-slate-200 pb-6">Bag Summary</h3>
              <div className="space-y-6 mb-12">
                 <div className="flex justify-between text-xs tracking-widest uppercase text-slate-500 font-bold"> <span>Subtotal</span> <span>${cartTotal.toFixed(2)}</span> </div>
                 <div className="flex justify-between text-xs tracking-widest uppercase text-slate-500 font-bold"> <span>Shipping</span> <span>Complimentary</span> </div>
              </div>
              <div className="flex justify-between font-bold text-2xl mb-12 border-t border-slate-200 pt-8 tracking-tighter"> <span className="font-serif italic text-slate-900">Total</span> <span className="text-amber-600">${cartTotal.toFixed(2)}</span> </div>
              <button onClick={() => navigateTo('checkout')} className="w-full bg-slate-900 text-white py-6 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-amber-600 transition-all duration-500 shadow-2xl">Proceed to Checkout</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-40 bg-[#FDFBF7] rounded-sm border border-dashed border-slate-200">
          <ShoppingBag className="w-16 h-16 text-slate-200 mx-auto mb-10" />
          <p className="text-slate-400 font-serif italic text-2xl mb-12">Maison archives indicate your bag is currently empty.</p>
          <button onClick={() => navigateTo('shop')} className="bg-slate-900 text-white px-12 py-5 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-amber-600 transition-all shadow-xl">Explore Collection</button>
        </div>
      )}
    </div>
  );
};

const CheckoutPage = () => {
  const { cartTotal, navigateTo, clearCart } = useStore();
  const [completed, setCompleted] = useState(false);
  const handlePlaceOrder = (e) => { e.preventDefault(); setCompleted(true); clearCart(); };
  if (completed) return (
    <div className="pt-40 pb-40 flex flex-col items-center text-center px-6 animate-in zoom-in duration-500">
      <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-8"> <CheckCircle className="w-10 h-10" /> </div>
      <h1 className="text-4xl font-serif mb-4 italic">Your Order is Confirmed</h1>
      <p className="text-slate-500 text-lg italic max-w-md mx-auto mb-12"> Thank you for choosing Lumière Luxe. Your artisan-crafted selection is being prepared for dispatch. </p>
      <button onClick={() => navigateTo('home')} className="bg-slate-900 text-white px-12 py-5 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-amber-600 transition-all"> Return to Maison </button>
    </div>
  );
  return (
    <div className="pt-40 pb-32 max-w-7xl mx-auto px-6 animate-in fade-in duration-500">
      <h1 className="text-5xl font-serif mb-20 italic">Finalizing Order</h1>
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        <div className="lg:col-span-8 space-y-16">
          <section> <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] mb-10 flex items-center text-amber-600"> <span className="w-8 h-8 rounded-full border border-amber-600 flex items-center justify-center text-[10px] mr-4">01</span> Delivery Details </h3> <div className="grid grid-cols-1 md:grid-cols-2 gap-10"> <input required type="text" placeholder="First Name" className="w-full border-b border-slate-200 py-4 focus:outline-none focus:border-amber-500 font-light italic" /> <input required type="text" placeholder="Last Name" className="w-full border-b border-slate-200 py-4 focus:outline-none focus:border-amber-500 font-light italic" /> <div className="md:col-span-2"> <input required type="text" placeholder="Street Address" className="w-full border-b border-slate-200 py-4 focus:outline-none focus:border-amber-500 font-light italic" /> </div> <input required type="text" placeholder="City" className="w-full border-b border-slate-200 py-4 focus:outline-none focus:border-amber-500 font-light italic" /> <input required type="text" placeholder="Postcode" className="w-full border-b border-slate-200 py-4 focus:outline-none focus:border-amber-500 font-light italic" /> </div> </section>
          <section> <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] mb-10 flex items-center text-amber-600"> <span className="w-8 h-8 rounded-full border border-amber-600 flex items-center justify-center text-[10px] mr-4">02</span> Payment Method </h3> <div className="space-y-10"> <input required type="text" placeholder="Card Number" className="w-full border-b border-slate-200 py-4 focus:outline-none focus:border-amber-500 font-light tracking-widest" /> <div className="grid grid-cols-2 gap-10"> <input required type="text" placeholder="MM / YY" className="w-full border-b border-slate-200 py-4 focus:outline-none focus:border-amber-500 font-light" /> <input required type="text" placeholder="CVV" className="w-full border-b border-slate-200 py-4 focus:outline-none focus:border-amber-500 font-light" /> </div> </div> </section>
        </div>
        <div className="lg:col-span-4">
          <div className="bg-[#FDFBF7] p-12 rounded-sm border border-slate-100 shadow-xl sticky top-40">
            <h3 className="text-xl font-serif mb-8 text-slate-900">Summary</h3>
            <div className="space-y-5 mb-10 text-slate-500"> <div className="flex justify-between text-[10px] tracking-widest uppercase"> <span>Merchandise</span> <span>${cartTotal.toFixed(2)}</span> </div> <div className="flex justify-between text-[10px] tracking-widest uppercase"> <span>Secure Shipping</span> <span>$25.00</span> </div> </div>
            <div className="border-t border-slate-200 pt-8 flex justify-between font-bold text-2xl mb-12 tracking-tighter"> <span className="font-serif italic text-slate-900">Total</span> <span className="text-amber-600">${(cartTotal + 25).toFixed(2)}</span> </div>
            <button type="submit" className="w-full bg-slate-900 text-white py-6 text-[10px] font-bold uppercase tracking-[0.5em] hover:bg-amber-600 transition-all duration-500 shadow-2xl"> Place Order </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const WishlistPage = () => {
  const { wishlist, navigateTo } = useStore();
  return (
    <div className="pt-40 pb-32 max-w-7xl mx-auto px-6 animate-in fade-in duration-500 text-center">
      <h1 className="text-5xl font-serif mb-10 italic">Your Favorites</h1>
      <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-400 mb-24">Curated pieces reserved just for you</p>
      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-left">
          {wishlist.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="py-40 bg-[#FDFBF7] rounded-sm border border-dashed border-slate-200"> <Heart className="w-16 h-16 text-slate-200 mx-auto mb-10" /> <p className="text-slate-400 italic text-xl font-serif">You haven't added any pieces to your favorites yet.</p> </div>
      )}
    </div>
  );
};

const AboutPage = () => (
  <div className="pt-40 pb-32 animate-in fade-in duration-1000">
    <section className="max-w-7xl mx-auto px-6 text-center">
       <p className="text-[10px] font-bold uppercase tracking-[0.6em] text-amber-600 mb-8">Brand Story</p>
      <h1 className="text-6xl md:text-8xl font-serif mb-20 leading-tight">Crafting <span className="italic">Heritage</span> since 1994.</h1>
      <div className="max-w-5xl mx-auto">
        <div className="relative mb-24">
           <img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=1600" className="w-full rounded-sm shadow-2xl" alt="Lumiere Atelier" />
           <div className="absolute -bottom-12 -right-12 hidden lg:block p-16 bg-slate-900 text-white max-w-md text-left shadow-2xl">
              <p className="font-serif italic text-2xl mb-4">"A bag is more than an accessory. It is a vessel for your history."</p>
              <span className="text-[9px] uppercase tracking-[0.4em] font-bold text-amber-500">— Founder, Maria Valenti</span>
           </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 text-left items-center pt-10">
           <div> <h2 className="text-3xl font-serif mb-8 leading-snug">From the Heart of Florence, to the World.</h2> <p className="text-slate-500 text-lg font-light leading-loose"> Lumière Luxe stands at the intersection of artisanal tradition and avant-garde luxury. Every hide is inspected by master craftsmen, and every stitch is applied with the weight of our history. </p> </div>
           <div className="space-y-12">
              <div className="flex items-start space-x-8"> <span className="text-5xl font-serif text-amber-600 opacity-30">01</span> <div> <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] mb-3">Material Integrity</h4> <p className="text-slate-500 text-sm font-light leading-relaxed">We source only A-grade Italian leathers from ethical, certified tanneries.</p> </div> </div>
              <div className="flex items-start space-x-8"> <span className="text-5xl font-serif text-amber-600 opacity-30">02</span> <div> <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] mb-3">Master Artistry</h4> <p className="text-slate-500 text-sm font-light leading-relaxed">Each piece takes approximately 48 hours of focused hand-construction.</p> </div> </div>
           </div>
        </div>
      </div>
    </section>
  </div>
);

// --- MAIN APP COMPONENT ---
const App = () => {
  const { currentPage } = useStore();
  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />;
      case 'shop': return <ShopPage />;
      case 'blog': return <BlogPage />;
      case 'write-blog': return <WriteBlogPage />;
      case 'product': return <ProductPage />;
      case 'cart': return <CartPage />;
      case 'checkout': return <CheckoutPage />;
      case 'wishlist': return <WishlistPage />;
      case 'about': return <AboutPage />;
      default: return <HomePage />;
    }
  };
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-amber-100 selection:text-amber-900">
      <Navbar />
      <main> {renderPage()} </main>
      <Footer />
      <style>{`
        @keyframes scroll-line { 0% { transform: translateY(-100%); } 100% { transform: translateY(200%); } }
        .animate-scroll-line { animation: scroll-line 2s infinite ease-in-out; }
        @keyframes slow-zoom { 0% { transform: scale(1); } 100% { transform: scale(1.1); } }
        .animate-slow-zoom { animation: slow-zoom 20s infinite alternate ease-in-out; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
};

export default function AppWrapper() {
  return ( <AppProvider> <App /> </AppProvider> );
}