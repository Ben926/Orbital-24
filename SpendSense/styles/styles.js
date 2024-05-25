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
    paddingHorizontal: 160,
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
  }
});

export default styles;