import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import { Suspense, lazy } from 'react';
import Loader, { LoaderLayout } from './components/loader.tsx';
import Header from './components/header.tsx';
import { Toaster } from 'react-hot-toast'; 
import { useEffect } from 'react';
import { onAuthStateChanged} from 'firebase/auth';
import { auth } from './firebase.ts';
import { userExist, userNotExist } from './redux/reducer/userReducer.ts';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from './redux/api/userAPI.ts';
//import { UserReducerInitialState } from './types/reducer-types.ts';
import ProtectedRoute from './components/protected-route.tsx';
import { UserReducerInitialState } from './types/reducer-types.ts';

//renaming the browser router as _ ,_ ,_

const Home = lazy(()=>import('./pages/home.tsx'));
const Search=lazy(()=>import('./pages/search.tsx'));
const Cart = lazy(()=>import('./pages/cart.tsx'));
const Shipping = lazy(()=>import('./pages/shipping.tsx'));
const Login = lazy(()=>import('./pages/login.tsx'));
const Orders = lazy(()=>import('./pages/orders.tsx'));
const OrderDetails = lazy(()=>import('./pages/order-details.tsx'));
const NotFound = lazy(() => import("./pages/not-found"));
const Checkout = lazy(() => import('./pages/checkout.tsx'));


//admin routes importing 
const Dashboard = lazy(() => import("./pages/pages/admin/dashboard"));
const Products = lazy(() => import("./pages/pages/admin/products"));
const Customers = lazy(() => import("./pages/pages/admin/customers"));
const Transaction = lazy(() => import("./pages/pages/admin/transaction"));
const Barcharts = lazy(() => import("./pages/pages/admin/charts/barcharts"));
const Piecharts = lazy(() => import("./pages/pages/admin/charts/piecharts"));
const Linecharts = lazy(() => import("./pages/pages/admin/charts/linecharts"));
const Coupon = lazy(() => import("./pages/pages/admin/apps/coupon"));
const Stopwatch = lazy(() => import("./pages/pages/admin/apps/stopwatch"));
const Toss = lazy(() => import("./pages/pages/admin/apps/toss"));
const NewProduct = lazy(() => import("./pages/pages/admin/management/newproduct"));
const ProductManagement = lazy(
  () => import("./pages/pages/admin/management/productmanagement")
);
const TransactionManagement = lazy(
  () => import("./pages/pages/admin/management/transactionmanagement")
);



const App = () => { 

  const { user, loading } = useSelector((state: {userReducer:UserReducerInitialState}) => state.userReducer);

  const dispatch=useDispatch(); 
 // signOut(auth).then((c)=>console.log("yes"));

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data=await getUser(user.uid);
        console.log("logged in");
        dispatch(userExist(data.user));
      } else {
        dispatch(userNotExist());
        console.log("not logged in");
      }
    });
  }, []);


  return loading? <Loader/>:    
  ( <Router>
  <Header user={user}/>
  <Suspense fallback={<LoaderLayout/>}>
  <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/search' element={<Search/>}/>
    <Route path='/cart' element={<Cart/>}/>

    {/*Not Logged in route*/}
      <Route path='/login' element={
        <ProtectedRoute isAuthenticated={user?false:true}>
          <Login/>
        </ProtectedRoute>
        }
        />

    {/*Logged in user routes*/}
    <Route element={<ProtectedRoute isAuthenticated={user?true:false}/>}>
    <Route path='/shipping' element={<Shipping/>}/>
    <Route path='/orders' element={<Orders/>}/>
    <Route path='/order/:id' element={<OrderDetails/>}/>
    <Route path='/pay' element={<Checkout/>}/>
    </Route>

          {/*admin routes - now unprotected*/}
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/product" element={<Products />} />
          <Route path="/admin/customer" element={<Customers />} />
          <Route path="/admin/transaction" element={<Transaction />}/>
          {/* Charts */}
          <Route path="/admin/chart/bar" element={<Barcharts />} />
          <Route path="/admin/chart/pie" element={<Piecharts />} />
          <Route path="/admin/chart/line" element={<Linecharts />} />
          {/* Apps */}
          <Route path="/admin/app/coupon" element={<Coupon />} />
          <Route path="/admin/app/stopwatch" element={<Stopwatch />} />
          <Route path="/admin/app/toss" element={<Toss />} />
          {/* Management */}
          <Route path="/admin/product/new" element={<NewProduct />} />
          <Route path="/admin/product/:id" element={<ProductManagement />} />
          <Route path="/admin/transaction/:id" element={<TransactionManagement />} />

<Route path="*" element={<NotFound />} />
</Routes>
</Suspense>
<Toaster position="bottom-center"/> 
</Router>
);

}

export default App;