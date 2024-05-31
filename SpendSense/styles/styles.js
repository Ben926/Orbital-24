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
  },
  flatList: {
    paddingHorizontal: 16,
  },
  categoryGridContainer: {
    height: 300, 
    marginBottom: 16
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
  }
});

export default styles;