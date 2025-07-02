import { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "restaurantOwner" | "admin";
}

const mockUsers: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "user" },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "restaurantOwner",
  },
  { id: 3, name: "Admin User", email: "admin@example.com", role: "admin" },
  { id: 4, name: "Bob Johnson", email: "bob@example.com", role: "user" },
  {
    id: 5,
    name: "Alice Brown",
    email: "alice@example.com",
    role: "restaurantOwner",
  },
  { id: 6, name: "Charlie Wilson", email: "charlie@example.com", role: "user" },
  { id: 7, name: "Diana Davis", email: "diana@example.com", role: "admin" },
  {
    id: 8,
    name: "Eva Martinez",
    email: "eva@example.com",
    role: "restaurantOwner",
  },
];

const UsersTab = () => {
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const handleRoleFilterChange = (event: SelectChangeEvent) => {
    setRoleFilter(event.target.value);
  };

  const filteredUsers = mockUsers.filter(
    (user) => roleFilter === "all" || user.role === roleFilter
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "error";
      case "restaurantOwner":
        return "warning";
      case "user":
        return "primary";
      default:
        return "default";
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        Users Management
      </Typography>

      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Role</InputLabel>
          <Select
            value={roleFilter}
            label="Filter by Role"
            onChange={handleRoleFilterChange}
          >
            <MenuItem value="all">All Roles</MenuItem>
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="restaurantOwner">Restaurant Owner</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table sx={{ minWidth: 650 }} aria-label="users table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.main" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                ID
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Name
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Email
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Role
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { backgroundColor: "action.hover" },
                }}
              >
                <TableCell component="th" scope="row">
                  {user.id}
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    color={getRoleColor(user.role)}
                    variant="outlined"
                    sx={{ fontWeight: "medium" }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
        Showing {filteredUsers.length} of {mockUsers.length} users
      </Typography>
    </Box>
  );
};

export default UsersTab;
