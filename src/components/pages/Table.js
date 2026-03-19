import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getAllTables, fetchTables, fetchTablesSuccess } from '../../redux/tablesRedux';
import { Form, Button } from 'react-bootstrap';
import { API_URL } from '../config';

const STATUS_OPTIONS = ['Free', 'Reserved', 'Busy', 'Cleaning'];

const Table = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tables = useSelector(getAllTables);

  // Fetch tables if empty
  useEffect(() => {
    if (tables.length === 0) {
      dispatch(fetchTables());
    }
  }, [dispatch, tables.length]);

  // Find current table data
  const currentTable = tables.find(table => table.id === id);

  // If no such table, redirect to home
  useEffect(() => {
    if (tables.length > 0 && !currentTable) {
      navigate('/');
    }
  }, [tables, currentTable, navigate]);

  // Local state for form inputs
  const [status, setStatus] = useState(currentTable?.status || 'Free');
  const [peopleAmount, setPeopleAmount] = useState(currentTable?.peopleAmount || 0);
  const [maxPeopleAmount, setMaxPeopleAmount] = useState(currentTable?.maxPeopleAmount || 0);
  const [bill, setBill] = useState(currentTable?.bill || 0);

  // Sync local state when currentTable changes (after fetch)
  useEffect(() => {
    if (currentTable) {
      setStatus(currentTable.status);
      setPeopleAmount(currentTable.peopleAmount);
      setMaxPeopleAmount(currentTable.maxPeopleAmount);
      setBill(currentTable.bill);
    }
  }, [currentTable]);

  // Handlers with validation and logic
  const onStatusChange = (e) => {
    const val = e.target.value;
    setStatus(val);

    if (val === 'Busy' && bill === 0) {
      setBill(0); // show bill field with initial zero
    }

    if (val === 'Free' || val === 'Cleaning') {
      setPeopleAmount(0);
    }
  };

  const onMaxPeopleChange = (e) => {
    let val = Number(e.target.value);
    if (val < 0) val = 0;
    if (val > 10) val = 10;

    setMaxPeopleAmount(val);

    if (peopleAmount > val) {
      setPeopleAmount(val);
    }
  };

  const onPeopleChange = (e) => {
    let val = Number(e.target.value);
    if (val < 0) val = 0;
    if (val > maxPeopleAmount) val = maxPeopleAmount;

    setPeopleAmount(val);
  };

  const onBillChange = (e) => {
    let val = Number(e.target.value);
    if (val < 0) val = 0;
    setBill(val);
  };

  // Update handler: PATCH to API + update Redux
  const onUpdate = async () => {
    const updatedTable = {
      id,
      status,
      peopleAmount,
      maxPeopleAmount,
      bill,
    };

    try {
      const res = await fetch(`${API_URL}/tables/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTable),
      });

      if (!res.ok) throw new Error('Update failed');

      // Update Redux local store - dispatch action directly here for demo
      dispatch(fetchTablesSuccess(
        tables.map(t => (t.id === id ? updatedTable : t))
      ));

      navigate('/');
    } catch (err) {
      alert('Error updating table: ' + err.message);
    }
  };

  if (!currentTable) return null; // or loading spinner

  return (
    <>
      <h1>Table {id}</h1>
      <Form>
        <Form.Group className="mb-3" controlId="status">
          <Form.Label><strong>Status:</strong></Form.Label>
          <Form.Select value={status} onChange={onStatusChange}>
            {STATUS_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="people">
          <Form.Label><strong>People:</strong></Form.Label>
          <div className="d-flex align-items-center gap-2">
            <Form.Control
              type="number"
              value={peopleAmount}
              onChange={onPeopleChange}
              min={0}
              max={10}
              style={{ maxWidth: '80px' }}
            />
            /
            <Form.Control
              type="number"
              value={maxPeopleAmount}
              onChange={onMaxPeopleChange}
              min={0}
              max={10}
              style={{ maxWidth: '80px' }}
            />
          </div>
        </Form.Group>

        {status === 'Busy' && (
          <Form.Group className="mb-3" controlId="bill">
            <Form.Label><strong>Bill:</strong></Form.Label>
            <div className="d-flex align-items-center gap-1">
              <span>$</span>
              <Form.Control
                type="number"
                value={bill}
                onChange={onBillChange}
                min={0}
                style={{ maxWidth: '100px' }}
              />
            </div>
          </Form.Group>
        )}

        <Button variant="primary" onClick={onUpdate}>
          Update
        </Button>
      </Form>
    </>
  );
};

export default Table;