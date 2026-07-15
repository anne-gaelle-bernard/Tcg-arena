import axios from 'axios'

export const getCards = async () => {
  const response = await axios.get('http://localhost:3000/cards')

  return response.data
}