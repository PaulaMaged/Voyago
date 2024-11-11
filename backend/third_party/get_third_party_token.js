const AMADEUS_API_KEY = process.env.AMADEUS_API_KEY;
const AMADEUS_API_SECRET = process.env.AMADEUS_API_SECRET;
let amadeusToken = '';

// Function to obtain access token
const getAmadeusToken = async () => {
  try {
    const response = await axios.post(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: AMADEUS_API_KEY,
        client_secret: AMADEUS_API_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    amadeusToken = response.data.access_token;
    console.log('Amadeus Token Obtained');
  } catch (error) {
    console.error('Error obtaining Amadeus token:', error.response ? error.response.data : error.message);
  }
};

export default getAmadeusToken;