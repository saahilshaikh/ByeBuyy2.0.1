import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/homeScreen';
import LoginScreen from '../screens/loginScreen';
import SignInScreen from '../screens/signInScreen';
import ForgotScreen from '../screens/forgotScreen';
import SignUpScreen from '../screens/signUpScreen';
import SearchScreen from '../screens/searchScreen';
import AddItem from '../screens/addItem';
import AddRequest from '../screens/addRequest';
import ChatScreen from '../screens/chatScreen.js';
import LocationSelectorScreen from '../screens/locationSelector';
import ProfileEditScreen from '../screens/profileEditScreen';
import ViewProfileScreen from '../screens/viewProfileScreen';
import PhotoPickerScreen from '../screens/photoPickerScreen';
import ViewProductScreen from '../screens/viewProductScreen';
import ViewCommentScreen from '../screens/viewCommentScreen';
import ViewRequestScreen from '../screens/viewRequestScreen';
import ViewUsersListScreen from '../screens/viewUsersListScreen';
import MessageViewScreen from '../screens/messageViewScreen';
import ViewScreen from '../screens/viewScreen';
import EditProductScreen from '../screens/editProductScreen';
import EditRequest from '../screens/editRequest';
import AboutScreen from '../screens/aboutScreen';
import PrivacyPolicy from '../screens/ppScreen';
import Terms from '../screens/tcScreen';
import ReferScreen from '../screens/referScreen';
import DealDoneScreen from '../screens/dealDoneScreen';
import DealInfoScreen from '../screens/dealInfoScreen';
import ViewOtherUsersListScreen from '../screens/viewOtherUsers';

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Main" component={HomeScreen} />
      <Stack.Screen name="Loc" component={LocationSelectorScreen} />
      <Stack.Screen name="viewProduct" component={ViewProductScreen} />
      <Stack.Screen name="viewComment" component={ViewCommentScreen} />
      <Stack.Screen name="viewRequest" component={ViewRequestScreen} />
      <Stack.Screen name="viewUsers" component={ViewUsersListScreen} />
      <Stack.Screen
        name="viewOtherUsers"
        component={ViewOtherUsersListScreen}
      />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="viewProfile" component={ViewProfileScreen} />
      <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
      <Stack.Screen name="AddItem" component={AddItem} />
      <Stack.Screen name="PickPhotos" component={PhotoPickerScreen} />
      <Stack.Screen name="AddReq" component={AddRequest} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="messageView" component={MessageViewScreen} />
      <Stack.Screen name="EditItem" component={EditProductScreen} />
      <Stack.Screen name="EditRequest" component={EditRequest} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="Forgot" component={ForgotScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ViewDocument" component={ViewScreen} />
      <Stack.Screen name="Refer" component={ReferScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Privacy" component={PrivacyPolicy} />
      <Stack.Screen name="Terms" component={Terms} />
      <Stack.Screen name="Deal" component={DealDoneScreen} />
      <Stack.Screen name="DealInfo" component={DealInfoScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;
