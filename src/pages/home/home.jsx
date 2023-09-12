import { Button, Center, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ModalCreateCashier } from "../../components/login/modals/modal-create-new-cashier";

export const HomePage = () => {
  const [isCreateCashierModalOpen, setCreateCashierModalOpen] = useState(false);

  const nav = useNavigate();
  const userSelector = useSelector((state) => state.auth);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    nav("/login");
  };

  const toCashier = () => {
    nav("/home/cashier");
  };

  const openCreateCashierModal = () => {
    setCreateCashierModalOpen(true);
  };

  return (
    <>
      <Center display={"flex"} flexDir={"column"} mt={"2rem"}>
        <Text fontWeight={"bold"} fontSize={"2xl"}>
          HOME PAGE
        </Text>
        <Button onClick={handleLogout} color={"red"} mt={"1rem"}>
          LOGOUT
        </Button>
        <Button onClick={toCashier} mt={"1rem"} mb={"7rem"}>
          TO CASHIER PAGE
        </Button>
        <Button onClick={openCreateCashierModal}>Create New Cashier</Button>
      </Center>

      <ModalCreateCashier
        isOpen={isCreateCashierModalOpen}
        onClose={() => setCreateCashierModalOpen(false)}
      />
    </>
  );
};