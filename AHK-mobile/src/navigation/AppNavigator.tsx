import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandPage from '../screens/LandPage';
import BoxSelect from '../screens/BoxSelect';
import Writings from '../screens/Writings';
import ArtRoom from '../screens/ArtRoom';
import Credits from '../screens/Credits';
import PhotoRoom from '../screens/PhotoRoom';

const Stack = createNativeStackNavigator();

export default function AppNavigator(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={LandPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="BoxSelect" 
          component={BoxSelect}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Writings" 
          component={Writings}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ArtRoom" 
          component={ArtRoom}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Credits" 
          component={Credits}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="PhotoRoom" 
          component={PhotoRoom}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}