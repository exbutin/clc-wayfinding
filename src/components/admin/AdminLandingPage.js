import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminLandingPage() {
    return (
        <div className="container">
            <div className="my-3"></div>
            <Link to="/admin/map" className="text-decoration-none">
                <Card className="mb-3 shadow-sm" style={{ borderRadius: '10px' }}>
                    <Card.Header className="bg-primary text-white font-weight-bold" style={{ borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>Map Editor</Card.Header>
                    <Card.Body>
                        <Card.Text>Edit the pins by clicking them on the map, or clicking the map to add a new pin.</Card.Text>
                    </Card.Body>
                </Card>
            </Link>
            <Link to="/admin/table-editor" className="text-decoration-none">
                <Card className="mb-3 shadow-sm" style={{ borderRadius: '10px' }}>
                    <Card.Header className="bg-primary text-white font-weight-bold" style={{ borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>Table Editor</Card.Header>
                    <Card.Body>
                        <Card.Text>Edit the tables that are queried by the app to place the pins, and their popup content, on the map.</Card.Text>
                    </Card.Body>
                </Card>
            </Link>
        </div>
    );
}

export default AdminLandingPage;