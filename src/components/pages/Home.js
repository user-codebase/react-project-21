import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTables, getAllTables } from '../../redux/tablesRedux';
import { ListGroup, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const dispatch = useDispatch();
  const tables = useSelector(getAllTables);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchTables());
  }, [dispatch]);

  return (
    <>
      <h1>All tables</h1>
      <ListGroup>
        {tables.map(({ id, status }) => (
          <ListGroup.Item
            key={id}
            className="d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>Table {id}</strong>{' '}
              <small>Status: <em>{status}</em></small>
            </div>

            <Button
              variant="primary"
              onClick={() => navigate(`/table/${id}`)}
            >
              Show more
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
};

export default Home;