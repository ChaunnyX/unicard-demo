import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import CookieNotice from './components/CookieNotice'
import { Toasts } from './components/ui'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ProductPage from './pages/Product'
import OrderPage from './pages/Order'
import Legal from './pages/Legal'
import AccountLayout from './pages/account/Layout'
import Dashboard from './pages/account/Dashboard'
import TopUp from './pages/account/TopUp'
import Orders from './pages/account/Orders'
import Subs from './pages/account/Subs'
import VpnConnect from './pages/account/VpnConnect'
import Cards from './pages/account/Cards'
import Transfers from './pages/account/Transfers'
import AdminLayout from './pages/admin/Layout'
import AdminDashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import AdminOrders from './pages/admin/Orders'
import AdminUsers from './pages/admin/Users'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0 }) }, [pathname])
  return null
}

export default function App() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')
  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/c/:cat" element={<Catalog />} />
        <Route path="/p/:id" element={<ProductPage />} />
        <Route path="/order/:id" element={<OrderPage />} />
        <Route path="/legal/:doc?" element={<Legal />} />
        <Route path="/account" element={<AccountLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="topup" element={<TopUp />} />
          <Route path="orders" element={<Orders />} />
          <Route path="subs" element={<Subs />} />
          <Route path="vpn/:id" element={<VpnConnect />} />
          <Route path="cards" element={<Cards />} />
          <Route path="transfers" element={<Transfers />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
        <Route path="*" element={<Home />} />
      </Routes>
      {!isAdmin && <Footer />}
      {!isAdmin && <CookieNotice />}
      <AuthModal />
      <Toasts />
    </>
  )
}
