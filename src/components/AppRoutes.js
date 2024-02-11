import { Route, Routes } from 'react-router-dom';
import AdminLogin from './admin/AdminLogin';
import LandingPage from "./LandingPage";
import AdminLocationSymbols from './admin/AdminLocationSymbols';
import AdminTableEditor from './admin/AdminTableEditor'; 
import Map from "./Map";
import AdminLandingPage from './admin/AdminLandingPage';
import FabPage from './FabPage';

function AppRoutes({ isAdmin, handleLogin }) {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/map" element={<Map isAdmin={false} />} />
                <Route path="/menu" element={<FabPage isAdmin={false} />} />
                {isAdmin ? (
                    <>
                        <Route path="/admin" element={<AdminLandingPage />} />
                        <Route path="/admin/map" element={
                            <Map isAdmin={isAdmin}>
                                <AdminLocationSymbols/>
                            </Map>
                        } />
                        <Route path="/admin/table-editor" element={<AdminTableEditor />} />
                    </>
                ) : (
                    <Route path="/admin" element={<AdminLogin onLogin={handleLogin} />} />
                )}
            </Routes>
        </div>
    );
}

export default AppRoutes;