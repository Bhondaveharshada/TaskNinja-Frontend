import { IonBackButton, IonButton, IonButtons, IonCard,IonToast, IonCardContent, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonInputOtp, IonInputPasswordToggle, IonPage, IonRow, IonTitle, IonToolbar, useIonToast, IonNote, IonImg } from '@ionic/react';
import { cameraOutline, checkmarkDoneCircleOutline, checkmarkDoneOutline, logInOutline, personCircleOutline } from 'ionicons/icons';
import React, { useRef, useState } from 'react';
import {registerloginapi} from "../apis/api"
import "./Register.css"

const Register: React.FC = () => {
  const [presentToast] = useIonToast()
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState<string | ArrayBuffer | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [imageError, setImageError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image type and size
    if (!file.type.match('image.*')) {
      setImageError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setImageError('Image size should be less than 5MB');
      return;
    }

    setImageError('');
    setProfileImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };


   const handleRegister = async (event: any) => {
    event.preventDefault();

    setNameError('')
    setEmailError('')
    setPasswordError('')

    let valid = true

    if(!name.trim()){
      setNameError("FullName is required")
      valid = false
    }

    if(!email.trim()){
      setEmailError("Email is required")
      valid = false
    }else if (!validateEmail(email)){
      setEmailError("Invalid email format")
      valid = false
    }

    if(!password){
      setPasswordError("Password is required")
      valid = false
    }else if (password.length < 6){
      setPasswordError("Password must be at least 6 characters")
      valid = false
    }

    if(!valid) return



    try {
      const response = await registerloginapi.post('/user/register', { name, email,password,});
      presentToast({
      message: 'Registration successful!',
      duration: 3000,
      position: 'top',
      });
    setName("")
    setEmail("")
    setPassword("")
      // optionally show a toast or redirect user
    } catch (error: any) {
      console.error('Registration failed:', error.response?.data || error.message);
      presentToast({
      message: 'Registration failed!',
      duration: 3000,
      position: 'top',
      color: 'danger'
      
    });
      // optionally show an error toast
    }
  };

    return (
         <IonPage >
            <IonHeader >
              
                    
                    <div className='title'>
                      <IonTitle >TaskNinja</IonTitle>
                    </div>
            
            </IonHeader>
            <IonContent className="ion-padding">
               
              <br />
              <IonGrid fixed>
                <IonRow className='ion-justify-content-center'>
                    <IonCol size="12" sizeMd="10" sizeLg="8" sizeXl="6" className='ion-justify-content-center'>
                        <IonCard>
                <IonCardContent>
                   <form onSubmit={handleRegister}>
                    <IonInput  fill='outline' labelPlacement='floating'  label='Name' placeholder='Enter Your Name' value={name} onIonChange={(e)=> setName(e.detail.value ?? '')}/>
                      {nameError && (<IonNote color={'danger'} className='ion-margin-start'>
                        {nameError}
                      </IonNote>)}
                    <IonInput className='ion-margin-top' fill='outline' labelPlacement='floating'  label='Email' placeholder='example@gmail.com' value={email} onIonChange={(e)=>setEmail(e.detail.value ?? " ")} />
                      {emailError && (<IonNote color={'danger'} className='ion-margin-start'>
                        {emailError}
                      </IonNote>)}
                    <IonInput className='ion-margin-top' labelPlacement='floating' fill='outline' label='Password' type="password"  placeholder='Enter Your Password' value={password} onIonChange={(e)=>setPassword(e.detail.value ?? '')}>
                     <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
                     {passwordError && (<IonNote color={'danger'} className='ion-margin-start'>
                        {passwordError}
                      </IonNote>)}
                     </IonInput>
                     <div className="ion-text-center ion-margin-bottom">
                      <div onClick={triggerFileInput} style={{ cursor: 'pointer' }}>
                        {profileImage ? (
                          <IonImg 
                            src={profileImage as string} 
                            style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto' }}
                          />
                        ) : (
                          <div style={{ 
                            width: '100px', 
                            height: '100px', 
                            borderRadius: '50%', 
                            backgroundColor: '#f4f5f8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto'
                          }}>
                            <IonIcon icon={cameraOutline} style={{ fontSize: '2rem' }} />
                          </div>
                        )}
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          onChange={handleImageChange}
                          accept="image/*"
                          style={{ display: 'none' }}
                        />
                      </div>
                      <IonButton 
                        fill="clear" 
                        size="small" 
                        onClick={triggerFileInput}
                      >
                        {profileImage ? 'Change Photo' : 'Upload Photo'}
                      </IonButton>
                      {imageError && (
                        <IonNote color={'danger'} className='ion-margin-start'>
                          {imageError}
                        </IonNote>
                      )}
                    </div>
                   <IonButton  className='ion-margin-top' color={'secondary'}  type='submit' expand='block'>
                   Create My Account
                   <IonIcon icon={checkmarkDoneOutline} slot='end'></IonIcon>
                   </IonButton>
                   <IonButton   className='ion-margin-top'  routerLink='/login' type='button' expand='block'>
                    Want to Login
                    <IonIcon icon={logInOutline} slot='end'></IonIcon>
                   </IonButton>
                  
                   </form>
                </IonCardContent>
              </IonCard>
                    </IonCol> 
                    </IonRow>
                
              </IonGrid>
             
              
              
            </IonContent>
        </IonPage>
    );
};

export default Register;