import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandPage from '../screens/LandPage';
import BoxSelect from '../screens/BoxSelect';

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}