import { useEffect, useMemo, useState } from "react";
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
  Button,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { changeUserStatus, getAllUsers } from "../../server/server";
import { BlockFlipped, Check } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
interface User {
  id: number;
  username: string;
  email: string;
  role: "ROLE_USER" | "ROLE_RESTAURANT_OWNER" | "ROLE_ADMIN";
  status: string;
}

const UsersTab = () => {
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [users, setUsers] = useState<User[]>([]);
 const {t} = useTranslation()
  const getUsers = async () => {
    const data = await getAllUsers();
    setUsers(data);
    console.log(data);
  };
  useEffect(() => {
    getUsers();
  }, []);
  const handleChangeUserStatus =async (id: number, status: string) => {
    await changeUserStatus(id, status);
    getUsers();
  };
  useMemo(()=>{
getUsers()
  },[])
  const handleRoleFilterChange = (event: SelectChangeEvent) => {
    setRoleFilter(event.target.value);
  };

  const filteredUsers = users.filter(
    (user) => roleFilter === "all" || user.role === roleFilter
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ROLE_ADMIN":
        return "error";
      case "ROLE_RESTAURANT_OWNER":
        return "warning";
      case "ROLE_CUSTOMER":
        return "primary";
      default:
        return "default";
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        {t('userManagement')}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Role</InputLabel>
          <Select
            value={roleFilter}
            label="Filter by Role"
            onChange={handleRoleFilterChange}
          >
            <MenuItem value="all">{t('allRoles')}</MenuItem>
            <MenuItem value="ROLE_CUSTOMER">{t('user')}</MenuItem>
            <MenuItem value="ROLE_RESTAURANT_OWNER">{t("restaurantOwner")}</MenuItem>
            <MenuItem value="ROLE_ADMIN">Admin</MenuItem>
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
                {t('name')}
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Email
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                {t('role')}
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Status
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                {t('actions')}
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
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    color={getRoleColor(user.role)}
                    variant="outlined"
                    sx={{ fontWeight: "medium" }}
                  />
                </TableCell>
                <TableCell> {user.status}</TableCell>
                <TableCell>
                  <div className={"flex gap-1"}>
                    <Button
                      sx={{ color: "red" }}
                      onClick={() => handleChangeUserStatus(user.id, "block")}
                    >
                      <BlockFlipped />
                    </Button>
                    <Button
                      sx={{ color: "green" }}
                      onClick={() => handleChangeUserStatus(user.id, "active")}
                    >
                      <Check />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
       {t('filteredUsers',{filteredUsersLength:filteredUsers.length, usersLength:users.length})}
      </Typography>
    </Box>
  );
};

export default UsersTab;