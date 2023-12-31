import { useEffect, useState } from "react";
import api from "../../api/api";
import {
  Box,
  Button,
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { ModalDisableCashier } from "../modals/modal-disable-cashier";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { ModalCreateCashier } from "../modals/modal-create-new-cashier";
import { ModalDeleteCashier } from "../modals/modal-delete-cashier";
import { ModalChangePassword } from "../modals/modal-change-password";

export const TableEmployee = ({ onClose, isOpen }) => {
  const [cashier, setCashier] = useState([]);
  const toast = useToast();
  const [openModalDisable, setOpenModalDisable] = useState(false);
  const [userToDisable, setUserToDisable] = useState({
    email: "",
    isDisabled: false,
  });
  //delete
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openChangeModal, setOpenChangeModal] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState("");
  const [emailToChange, setEmailToChange] = useState("");
  // const [newPassword, setNewPassword] = useState("");

  function openDeleteModalWithCashier(emailToDelete) {
    setEmailToDelete(emailToDelete);
    setOpenDeleteModal(true);
  }

  function OpenChangePasswordModal(emailToChange) {
    setEmailToChange(emailToChange);
    setOpenChangeModal(true);
  }

  function closeDeleteModal() {
    setOpenDeleteModal(false);
  }

  function closeChangeModal() {
    setOpenChangeModal(false);
  }

  async function confirmChangePassword(emailToChange, newPassword) {
    try {
      // const { email } = emailToChange;
      // console.log("email", email);

      const response = await api.patch(
        `/users/changePassword/${emailToChange}`,
        {
          newPassword: newPassword,
        }
      );

      // console.log("newPassword", newPassword);
      console.log("response", response);

      if (response.status === 200) {
        toast({
          title: "Password Changed",
          description: "The password has been changed successfully.",
          status: "success",
          position: "top",
          duration: 3000,
          isClosable: true,
        });
        closeChangeModal();
      } else {
        toast({
          title: "Error",
          description: "An error occurred while changing the password.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error?.message);
      toast({
        title: "Error",
        description: "An error occurred while changing the password.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  const fetchCashier = async () => {
    await api.get("/users/cashier").then((result) => setCashier(result.data));
  };

  const toggleDisable = async (email, isDisabled) => {
    setUserToDisable({ email, isDisabled });
    // Set the modal to open
    setOpenModalDisable(true);
  };

  const confirmToggleDisable = async () => {
    try {
      const { email, isDisabled } = userToDisable;
      const updatedStatus = isDisabled ? false : true;

      await api.patch("/users/disable", { email, isDisable: updatedStatus });

      setCashier((prevCashier) =>
        prevCashier.map((employee) =>
          employee.email === email
            ? { ...employee, isDisable: updatedStatus }
            : employee
        )
      );
      toast({
        title: isDisabled ? "User Enabled" : "User Disabled",
        description: isDisabled
          ? "The user has been enabled successfully."
          : "The user has been disabled successfully.",
        position: "top",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log("error toggling user status", error);
      toast({
        title: "Error",
        description: "An error occurred while toggling the user status.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setOpenModalDisable(false);
    }
  };

  const deleteCashier = async (emailToDelete) => {
    try {
      await api.delete(`/users/delete/${emailToDelete}`);

      setCashier((prevCashier) =>
        prevCashier.filter((employee) => employee.email !== emailToDelete)
      );
      toast({
        title: "Cashier Deleted",
        description: "The cashier has been deleted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log("error deleting cashier", error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the cashier.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchCashier();
  }, []);

  return (
    <Box overflowX="auto" className="max-sm: mt-5">
      <Table
        variant="simple"
        size={["sm", "md", "lg"]} // Responsive table size based on screen size
        spacing={3} // Add spacing between columns and rows
      >
        <Thead>
          <Tr>
            <Th>No.</Th>
            <Th className="max-sm:hidden">First Name</Th>
            <Th className="max-sm:hidden">Last Name</Th>
            <Th>Email</Th>
            <Th className="max-sm:hidden">Gender</Th>
            <Th display={"flex"} justifyContent={"center"}>
              Action
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {cashier.map((employee, index) => (
            <Tr
              key={index}
              // className="hover:scale-95 transform hover:shadow-md hover:bg-blue-50"
            >
              <Td>{index + 1}</Td>
              <Td className="max-sm:hidden">{employee.first_name}</Td>
              <Td className="max-sm:hidden">{employee.last_name}</Td>
              <Td>{employee.email}</Td>
              <Td className="max-sm:hidden">{employee.gender}</Td>
              <Td>
                <Flex justify={"space-around"} alignItems={"center"}>
                  <Button
                    colorScheme={employee.isDisable ? "green" : "red"}
                    size={["xs", "sm", "sm"]} // Responsive button size based on screen size
                    boxShadow={"xl"}
                    onClick={() =>
                      toggleDisable(employee.email, employee.isDisable)
                    }
                  >
                    {employee.isDisable ? "Enable" : "Disable"}
                  </Button>
                  <Button
                    ml={"3"}
                    size={"sm"}
                    boxShadow={"lg"}
                    onClick={() => openDeleteModalWithCashier(employee.email)}
                    className="max-sm:w-1 text-xs"
                  >
                    <DeleteIcon />
                  </Button>
                  <Button
                    ml={"3"}
                    size={"sm"}
                    boxShadow={"lg"}
                    onClick={() => OpenChangePasswordModal(employee.email)}
                  >
                    <EditIcon />
                  </Button>
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <ModalCreateCashier
        isOpen={isOpen}
        onClose={onClose}
        fetchCashier={fetchCashier}
      />
      <ModalDisableCashier
        isOpen={openModalDisable}
        onClose={() => setOpenModalDisable(false)}
        onConfirm={confirmToggleDisable}
      />
      <ModalDeleteCashier
        isOpen={openDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={() => {
          deleteCashier(emailToDelete);
          closeDeleteModal();
        }}
      />
      <ModalChangePassword
        isOpen={openChangeModal}
        onClose={closeChangeModal}
        onConfirm={(emailToChange, newPassword) => {
          confirmChangePassword(emailToChange, newPassword);
        }}
        emailToChange={emailToChange}
      />
    </Box>
  );
};
