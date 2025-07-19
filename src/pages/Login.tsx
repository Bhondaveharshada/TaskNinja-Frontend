import { IonBackButton, IonButton,useIonToast, IonButtons, IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonInputPasswordToggle, IonPage, IonRow, IonTitle, IonToolbar, useIonRouter, IonNote, IonText } from '@ionic/react';
import { logInOutline, personCircleOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { registerloginapi } from '../apis/api';

const Login: React.FC = () => {
  const router = useIonRouter()
  const [presentToast] = useIonToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (value:string) =>{
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value)
  }

 const handleLogin = async (event: any) => {
  event.preventDefault();

   setEmailError('');
   setPasswordError('');

   let valid = true
   if(!email){
    setEmailError('Email is required')
    valid = false
   }else if (!validateEmail(email)){
    setEmailError('invalid Email format')
    valid = false
   }

  if (!password) {
    setPasswordError('Password is required');
    valid = false;
  }

  if (!valid) return;

  try {
    const response = await registerloginapi.post('/user/login', {
      email,
      password,
    });

    const { token, user } = response.data;

    // Store in localStorage as an object (stringified)
    localStorage.setItem('userData', JSON.stringify({ token, user }));
    localStorage.setItem('userId', user._id);

    presentToast({
      message: 'Login successful!',
      duration: 2000,
      position: 'top',
      color: 'success',
    });
    setEmail('');
    setPassword('');
    router.push('/app/myprojects');

  } catch (error: any) {
    presentToast({
      message: error.response?.data?.message || 'Login failed',
      duration: 2000,
      position: 'top',
      color: 'danger',
    });
  }
};


    return (
        <IonPage>
      <IonHeader >
        <IonToolbar style={{
  '--background': 'var(--ion-color-gradient)',
  color: 'white'}}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" color="light"></IonBackButton>
          </IonButtons>
          <IonTitle>Login Page</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
       
        <br />
        <IonGrid fixed>
          <IonRow className="ion-justify-content-center ">
            <IonCol size="12" sizeMd="10" sizeLg="8" sizeXl="6" >
            <IonCard style={{ margin: 'auto', padding : "20px" }}>
             <IonCard>
          <IonText className="ion-text-center">
        <h2>Login</h2>
      </IonText>
          <IonCardContent>
            <form onSubmit={handleLogin}>
              <IonInput
                fill="outline"
                labelPlacement="floating"
                label="Email"
                placeholder="example@gmail.com"
                value={email}
                onIonChange={(e) => setEmail(e.detail.value ?? '')}
              />
               {emailError && (
                      <IonNote color="danger" className="ion-padding-start">
                        {emailError}
                      </IonNote>
                    )}
                    <br />
              <IonInput
                className="ion-margin-top"  
                labelPlacement="floating"
                fill="outline"
                label="Password"
                type="password"
                placeholder="Enter Your Password"
                value={password}
                onIonChange={(e) => setPassword(e.detail.value ?? '')}
              >
                <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
              </IonInput>
              {passwordError && (
                    <IonNote color={'danger'} className='ion-padding-start'>
                    {passwordError}
                    </IonNote>
              )}
              <IonButton
                className="ion-margin-top"
                type="submit"
                expand="block"
              >
                Login
                <IonIcon icon={logInOutline} slot="end"></IonIcon>
              </IonButton>
              <IonButton
                className="ion-margin-top"
                color={"secondary"}
                routerLink="/register"
                type="button"
                expand="block"
              >
                Create an account
                <IonIcon icon={personCircleOutline} slot="end"></IonIcon>
              </IonButton>
              
            </form>
          </IonCardContent>
        </IonCard>
            </IonCard>
        
            </IonCol>
          </IonRow>
        </IonGrid>
        
        
      </IonContent>
    </IonPage>
    );
};

export default Login;