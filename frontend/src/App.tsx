import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { RootLayout } from "./components/RootLayout";

import Admin from "./components/Admin";
import NotFound from "./components/NotFound";
import Home from "./components/Home";


export default function App() {
  return (
    <>
      <Toaster theme="dark" position="top-right" />
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
