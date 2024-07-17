import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  indexContainer: {
    paddingTop: 16,
    flex: 1,
    backgroundColor: "white",
  },
  splashscreenContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100
  },
  loginContainer: {
    padding: 16,
    backgroundColor: 'white',
    flex: 1,
  },
  formContainer: {
    paddingHorizontal: 16,
    backgroundColor: 'white',
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
  },
  stockPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loginPasswordContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: 16,
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 16
  },
  logo: {
    width: 300,
    height: 300
  },
  welcomeText: {
    fontFamily: 'Figtree-Bold',
    paddingBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 24,
  },
  descriptionText: {
    fontFamily: 'Figtree',
    paddingBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  text2: {
    fontFamily: "Figtree",
    color: 'black',
    fontSize: 16,
    marginRight: 5,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    color: "black",
    fontFamily: "Figtree",
  },
  passwordInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: 'white',
    color: "black",
    fontFamily: "Figtree",
  },
  toggleButton: {
    position: 'absolute',
    right: 10,
    top: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',

  },
  button: {
    backgroundColor: '#49D469',
    paddingVertical: 12,
    paddingHorizontal: 100,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  timeUnselectButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#49D469',
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    elevation: 5,
  },
  monthButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#49D469',
    marginHorizontal: 120,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    elevation: 5,
  },
  timeButton: {
    backgroundColor: '#49D469',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    elevation: 5,
  },
  transparentButton: {
    backgroundColor: 'transparent',
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderRadius: 0,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  backButton: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 0,
    borderRadius: 0,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  createTransactionButton: {
    backgroundColor: 'transparent',
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderRadius: 0,
    alignItems: 'center',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: "Figtree-Bold"
  },
  colorIndicator: {
    width: 15,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  transparentButtonText: {
    color: '#49D469',
    fontSize: 16,
    fontFamily: "Figtree-Bold",
  },
  createAccButtonText: {
    color: '#49D469',
    fontSize: 16,
    fontFamily: "Figtree-Bold",
    textDecorationLine: 'underline',
  },
  forgotPasswordText: {
    color: '#007bff',
    fontSize: 16,
    fontFamily: "Figtree",
    textAlign: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 300,
    height: 300,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  datetimepicker: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  panelContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 16,
  },
  categorySquare: {
    width: 90,
    height: 90,
    backgroundColor: '#f0f0f0',
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  selectedCategory: {
    backgroundColor: '#49D469',
  },
  categoryText: {
    color: 'black',
    textAlign: 'center',
    fontFamily: "Figtree-Bold",
    fontSize: 12
  },
  flatList: {
    paddingHorizontal: 16,
  },
  categoryGridContainer: {
    height: 300,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
  },
  transactionContainer: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  transactionItem: {
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  colorIndicator: {
    width: 15,
    height: 50,
    borderRadius: 5,
    marginRight: 15,
    marginBottom: 10,
    marginTop: 10
  },
  transactionContent: {
    flex: 1,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionDescription: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    fontFamily: 'Figtree'
  },
  deleteButton: {
    marginLeft: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.6)',
    borderRadius: 5,
    padding: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,

  },
  transactionCategory: {
    fontSize: 14,
    color: '#555',
    fontFamily: 'Figtree'
  },
  transactionDate: {
    fontSize: 14,
    color: '#555',
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Figtree'
  },
  transactionTimestamp: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'Figtree'
  },
  topRightButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 10,

  },
  viewAllButton: {
    padding: 5,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
  viewAllButtonText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Figtree'
  },
  addCategorySquare: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    padding: 10,
  },
  transactionFormContainer: {
    paddingTop: 80,
    paddingBottom: 20,
    flex: 1,
    backgroundColor: "white",
  },
  editContainer: {
    paddingTop: 80,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 20,
    flex: 1,
    backgroundColor: "white",
  },
  filterContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  filterContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center'
  },
  filterTitle: {
    fontSize: 20,
    marginBottom: 20
  },
  filterPicker: {
    width: '100%',
    height: 200
  },
  stockSymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Figtree'
  },
  stockPrice: {
    fontSize: 20,
    color: '49D469',
    fontFamily: 'Figtree'
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  stockChart: {
    marginVertical: 10,
    borderRadius: 16,
    alignSelf: 'center'
  },
  stockStatsContainer: {
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center'
  },
  stockStatsText : {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Figtree'
  },
  suggestionsList: {
    maxHeight: 200
  },
  searchBarContainer: {
    flex: 1,
    backgroundColor: "white"
  },
  questionButton: {
    position: 'absolute',
    bottom: -5,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'black',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionButtonText: {
    color: 'black',
    fontSize: 14,
    
  },
  descriptionContainer: {
    position: 'absolute',
    bottom: 20,
    right: 10,
  },
  analyticsDescription: {
    fontSize: 20,
    color: '#555',
    fontFamily: 'Figtree',
    flex: 1,
  },
  analyticsAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Figtree'
  },
  analyticsItem: {
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 1,
    paddingBottom: 1,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    alignItems: 'center', 
  },

});

export default styles;