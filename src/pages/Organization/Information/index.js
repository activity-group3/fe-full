import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useParams } from 'react-router-dom';

const OrganizationInformation = () => {
  const { id } = useParams();
  const [organizationInfo, setOrganizationInfo] = useState({
    id: id,
    organization_name: '',
    organization_type: '',
    representative_email: '',
    representative_phone: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOrganizationInfo();
    }
  }, [id]);

  const fetchOrganizationInfo = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8080/organizations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.status_code === 200) {
        setOrganizationInfo(data.data);
      } else {
        setError('Failed to fetch organization information');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrganizationInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8080/organizations/update`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(organizationInfo),
      });

      const data = await response.json();
      if (data.status_code === 200) {
        setSuccess(true);
      } else {
        setError('Failed to update organization information');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="p-6">
      <Typography variant="h4" className="mb-6">
        Organization Information
      </Typography>

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" className="mb-4">
          Organization information updated successfully!
        </Alert>
      )}

      <Paper className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <TextField
            fullWidth
            label="Organization Name"
            name="organization_name"
            value={organizationInfo.organization_name}
            onChange={handleChange}
            required
          />

          <FormControl fullWidth>
            <InputLabel>Organization Type</InputLabel>
            <Select
              name="organization_type"
              value={organizationInfo.organization_type}
              onChange={handleChange}
              required
            >
              <MenuItem value="CLUB">Club</MenuItem>
              <MenuItem value="COMPANY">Company</MenuItem>
              <MenuItem value="GOVERNMENT">Government</MenuItem>
              <MenuItem value="EDUCATIONAL">Educational</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Representative Email"
            name="representative_email"
            type="email"
            value={organizationInfo.representative_email}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            label="Representative Phone"
            name="representative_phone"
            value={organizationInfo.representative_phone}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Update Information
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default OrganizationInformation;

