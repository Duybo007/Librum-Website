"use client";

import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  ModalBody,
  ModalFooter,
  Center,
  Heading,
  Text,
  Box,
  Flex,
} from "@chakra-ui/react";

import { BeatLoader } from "react-spinners";

import { useRouter } from "next/navigation";

import { useRef, useState, useEffect } from "react";

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { userLogin, userRegistration } from "../../utils/apiFunctions";

const LoginButton = (props) => {
  // Page redirection
  const router = useRouter();

  // User auth state
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // User register state
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerFirstName, setRegisterFirstName] = useState("");
  const [registerLastName, setRegisterLastName] = useState("");

  // Modal state for login modal
  const {
    isOpen: isOpenLogin,
    onOpen: onOpenLogin,
    onClose: onCloseLogin,
  } = useDisclosure();

  // Modal state for register modal
  const {
    isOpen: isOpenRegister,
    onOpen: onOpenRegister,
    onClose: onCloseRegister,
  } = useDisclosure();

  const initialRef = useRef(null);

  // User auth state setters
  const handleEmail = (event) => setEmail(event.target.value);
  const handlePassword = (event) => setPassword(event.target.value);

  // User registration state setters
  const handleRegFName = (event) => setRegisterFirstName(event.target.value);
  const handleRegLName = (event) => setRegisterLastName(event.target.value);
  const handleRegEmail = (event) => setRegisterEmail(event.target.value);
  const handleRegPass = (event) => setRegisterPassword(event.target.value);

  // API handling - Login
  const queryClient = useQueryClient();

  const login = useMutation({
    mutationFn: userLogin,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["login"] });
      setToken(data);
      onCloseLogin();
      router.push("/profile");
    },
  });

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [token]);

  const handleLogin = (userInfo) => {
    login.mutate(userInfo);
  };

  // API handling - Register
  const register = useMutation({
    mutationFn: userRegistration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["register"] });
      onCloseRegister();
      onOpenLogin();
    },
  });

  // Logout function
  const logOut = () => {
    console.log("logging out");
    localStorage.removeItem("token");
    setToken(null);
  };

  // Register modal logic
  const registerAccount = () => {
    onCloseLogin();
    onOpenRegister();
  };

  const handleRegister = (data) => {
    register.mutate(data);
  };

  return (
    <>
      <Button
        onClick={token ? logOut : onOpenLogin}
        colorScheme="teal"
        variant="solid"
      >
        {token ? "LOGOUT" : "LOGIN"}
      </Button>

      {/* Login Modal */}
      <Modal
        isCentered
        initialFocusRef={initialRef}
        isOpen={isOpenLogin}
        onClose={onCloseLogin}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader background="#282c34"> </ModalHeader>
          <ModalCloseButton />
          <ModalBody background="#282c34">
            <Center>
              <Box textAlign="center" mb="1rem">
                <Heading size="md" color="white" pb=".5rem">
                  Welcome back!
                </Heading>
                <Text fontSize="xs" color="white">
                  Log into your account
                </Text>
              </Box>
            </Center>
            <FormControl>
              <FormLabel fontSize="xs" color="white">
                Email
              </FormLabel>
              <Input
                value={email}
                onChange={handleEmail}
                ref={initialRef}
                placeholder="Enter Your Email"
                fontSize="xs"
                textColor="white"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel fontSize="xs" color="white">
                Password
              </FormLabel>
              <Input
                value={password}
                onChange={handlePassword}
                placeholder="Enter Your Password"
                fontSize="xs"
                textColor="white"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter background="#282c34">
            <Box width="100%" textAlign="center">
              <Button
                onClick={() => {
                  handleLogin({ Email: email, Password: password });
                }}
                colorScheme="teal"
                width="100%"
                mb="1rem"
              >
                {login.isLoading ? <BeatLoader /> : "Log In"}
              </Button>
              <Button
                variant="ghost"
                width="100%"
                onClick={() => {
                  registerAccount();
                }}
              >
                Register
              </Button>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Register Modal */}
      <Modal
        isCentered
        initialFocusRef={initialRef}
        isOpen={isOpenRegister}
        onClose={onCloseRegister}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader background="#282c34"> </ModalHeader>
          <ModalCloseButton />
          <ModalBody background="#282c34">
            <Center>
              <Flex direction="column">
                <Box textAlign="center" mb="1rem">
                  <Heading size="md" color="white" pb=".5rem">
                    Welcome to Librum
                  </Heading>
                  <Text fontSize="xs" color="white">
                    Your credentials are only used to authenticate you. Your
                    credentials will be stored in a secure database.
                  </Text>
                </Box>
                <Flex gap="1rem" mb="1rem">
                  <FormControl>
                    <FormLabel fontSize="xs" color="white">
                      First Name
                    </FormLabel>
                    <Input
                      fontSize="xs"
                      textColor="white"
                      value={registerFirstName}
                      onChange={handleRegFName}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="xs" color="white">
                      Last Name
                    </FormLabel>
                    <Input
                      fontSize="xs"
                      textColor="white"
                      value={registerLastName}
                      onChange={handleRegLName}
                    />
                  </FormControl>
                </Flex>
                <Box>
                  <FormControl>
                    <FormLabel fontSize="xs" color="white">
                      Email
                    </FormLabel>
                    <Input
                      fontSize="xs"
                      textColor="white"
                      value={registerEmail}
                      onChange={handleRegEmail}
                    />
                  </FormControl>
                  <FormControl mt={4}>
                    <FormLabel fontSize="xs" color="white">
                      Password
                    </FormLabel>
                    <Input
                      fontSize="xs"
                      textColor="white"
                      value={registerPassword}
                      onChange={handleRegPass}
                    />
                  </FormControl>
                </Box>
              </Flex>
            </Center>
          </ModalBody>

          <ModalFooter background="#282c34">
            <Box width="100%" textAlign="center">
              <Button
                onClick={() => {
                  handleRegister({
                    FirstName: registerFirstName,
                    LastName: registerLastName,
                    Email: registerEmail,
                    Password: registerPassword,
                  });
                }}
                colorScheme="teal"
                width="100%"
                mb="1rem"
              >
                {register.isLoading ? <BeatLoader /> : "Let's Get Started"}
              </Button>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LoginButton;
