import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

axios.defaults.baseURL = 'http://13.125.116.197:8000';

export const getTokenFromLocal = async () => {
    try {
      const value = await AsyncStorage.getItem('Tokens');
      if (value !== null) {
        const token = JSON.parse(value);
        return token.accessToken;
      } else {
        return null;
      }
    } catch (error: any) {
      console.log(error.message);
    }
  }

export const getrefreshTokenFromLocal = async () => {
  try {
    const value = await AsyncStorage.getItem('Tokens');
    if (value !== null) {
      const token = JSON.parse(value);
      return token.refreshToken;
    } else {
      return null;
    }
  } catch (error: any) {
    console.log(error.message);
  }
}

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const response = await axios.post('/auth/refresh', { refreshToken });
    if (response.status === 200) {
      const newAccessToken = response.data.data.access_token;
      const newRefreshToken = response.data.data.refresh_token;

      await AsyncStorage.setItem('Tokens', JSON.stringify({
        'accessToken': newAccessToken,
        'refreshToken': newRefreshToken,
      }));

      return newAccessToken;
    }
  } catch (error) {
    console.error('Error refreshing access token:', error);
  }
  return null;
}

export const getme = async () => {
    try {
      const result = await axios.get('/users/me', {
        headers: {
          'Authorization': `${await getTokenFromLocal()}`,
        }
      });
      return result.data;
    } catch (e: any) {
        console.log('ref');
      
        try {
          const newAccessToken = await refreshAccessToken(await getrefreshTokenFromLocal());
          if (newAccessToken) {
            const result = await axios.get('/users/me', {
              headers: {
                'Authorization': `${newAccessToken}`,
              }
            });
            return result.data;
          }
        } catch (innerError) {
          console.error('Error fetching user data with new access token:', innerError);
        }
      }

    
  }