import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  indexContainer: {
    paddingTop: 16,
    paddingBottom: 20,
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
  logoContainer: {
    alignItems: 'center',
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
    paddingBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 24,
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
    marginVertical: 10,
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
  buttonText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: "Figtree-Bold"
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
    justifyContent: 'center',
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
    padding: 20,
    backgroundColor: '#fff',
  },
  transactionItem: {
    padding: 20,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  transactionDate: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionCategory: {
    fontSize: 14,
    color: '#888',
  },
  transactionAmount: {
    fontSize: 18,
    color: '#000',
  },
  transactionTimestamp: {
    flex: 1,
    textAlign: 'right',
  },
  transactionDescription: {
    fontSize: 14,
    marginTop: 8,
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
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'red',
    borderRadius: 12,
    padding: 3,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
  }
});

export default styles;