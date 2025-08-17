const creditCards = [
  {
    id: '1',
    background: require('../assets/images/credit-cards/01.png'),
  },
  {
    id: '2',
    background: require('../assets/images/credit-cards/02.png'),
  },
  {
    id: '3',
    background: require('../assets/images/credit-cards/03.png'),
  },
];

const categories = [
  {
    id: '1',
    category: 'All',
  },
  {
    id: '2',
    category: 'Pizza',
  },
  {
    id: '3',
    category: 'Salads',
  },
  {
    id: '4',
    category: 'Pasta',
  },
  {
    id: '5',
    category: 'Cakes',
  },
  {
    id: '6',
    category: 'Drinks',
  },
];

export const CHART_LABEL = [
  '23-01-01',
  '23-02-15',
  '23-03-22',
  '23-04-10',
  '23-05-05',
  '23-06-30',
];
export const CHART_DATA = [
  Math.random() * 100,
  Math.random() * 100,
  Math.random() * 100,
  Math.random() * 100,
  Math.random() * 100,
  Math.random() * 100,
];

export const PIE_CHART = [
  {
    name: 'Jan',
    color: 'rgba(131, 167, 234, 1)',
    value: 100000,
  },
  {
    name: 'Feb',
    value: 2800000,
    color: '#F00',
  },
  {
    name: 'Mar',
    value: 527612,
    color: 'red',
  },
  {
    name: 'April',
    value: 8538000,
    color: '#ffffff',
  },
  {
    name: 'May',
    value: 11920000,
    color: 'rgb(0, 0, 255)',
  },
];

const PLAN_TYPES = ['Bronze Plan', 'Silver Plan', 'Gold Plan'];
export { creditCards, categories, PLAN_TYPES };
