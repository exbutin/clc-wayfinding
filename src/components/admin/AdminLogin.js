import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminLogin({ onLogin }) {
    const [password, setPassword] = useState('password');

    const handleSubmit = (event) => {
        event.preventDefault();
        onLogin(password);
    };

    return (
        <div className="container h-100 pt-5">
            <div className="row h-100 d-flex justify-content-center align-items-center">
                <div className="col-12 col-md-6 col-lg-4">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-primary text-white p-2 rounded">
                            <h3>Password</h3>
                            <div className="form-group">
                                <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary w-100 mt-3">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;