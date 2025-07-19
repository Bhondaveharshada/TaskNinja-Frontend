import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonTextarea,
  IonButton,
  IonItem,
  IonLabel,
  IonToast,
  IonLoading,
  IonDatetime,
  IonList,
  IonBadge,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonDatetimeButton,
  IonModal,
} from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { useIonRouter , createAnimation } from '@ionic/react';
import type { Animation } from '@ionic/core';
import { api } from '../../apis/api';


let debounceTimer: any;

const CreateProject: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [members, setMembers] = useState<string[]>([]);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useIonRouter();

  const userId = localStorage.getItem('userId');

  // Debounced API call to validate member email
  useEffect(() => {
    if (!memberEmail) {
      setEmailValid(null);
      return;
    }

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      try {
        const res = await api.post('/user/checkemail', { email: memberEmail });
        setEmailValid(res.data.exists);
      } catch (err) {
        setEmailValid(false);
      }
    }, 200);

    return () => clearTimeout(debounceTimer);
  }, [memberEmail]);

  const handleAddMember = () => {
    if (emailValid && !members.includes(memberEmail)) {
      setMembers([...members, memberEmail]);
      setMemberEmail('');
      setEmailValid(null);
    }
  };

  const handleRemoveMember = (emailToRemove: string) => {
    setMembers(members.filter(email => email !== emailToRemove));
  };

  const handleSubmit = async () => {
    if (!name || !description || !deadline) {
      setError('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      await api.post('/projects/create', {
        title: name,
        description,
        deadline,
        owner: userId,
        members,
      });
      router.push('/dashboard/my-projects', 'back',"replace");
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Project creation failed');
    } finally {
      setLoading(false);
    }
  };
    const divEl = useRef<HTMLDivElement | null>(null);
   const cardEl = useRef<HTMLIonCardElement | null>(null);

  const animation = useRef<Animation | null>(null);

  useEffect(() => {
    if (cardEl.current) {
      animation.current = createAnimation()
        .addElement(cardEl.current)
        .duration(3000)
        .iterations(Infinity)
        .direction('alternate')
       
        .fromTo('background', 'purple','red', );
      animation.current.play();
    }
  }, [cardEl]);




  return (
    <IonPage>
      

      <IonContent className=" ion-padding" scrollY={false}>
        
         <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',  // Takes full viewport height
    padding: '16px'      // Optional padding
  }}>
        <IonGrid fixed>
          <IonRow className='ion-justify-content-center ion-align-items-center' >

            <IonCol size="12" sizeMd="8" sizeLg="6">
            <IonCard style={{ margin: 'auto', padding : "20px" }} ref={cardEl} >
              <IonCard className="ion-padding " >
                <IonCardHeader>
                  <IonCardTitle> Create New Project</IonCardTitle>
                </IonCardHeader>

                <IonCardContent>
                  
                    <IonLabel position="floating">Project Name *</IonLabel>
                    <IonInput 
                    fill='outline'
                      value={name} 
                      onIonChange={(e) => setName(e.detail.value!)} 
                      placeholder="Enter project name"
                    />
                 
                
                    <IonLabel position="floating">Description *</IonLabel>
                    <IonTextarea 
                      fill='outline'
                      value={description} 
                      onIonChange={(e) => setDescription(e.detail.value!)} 
                      placeholder="Enter project description"
                      rows={4}
                      autoGrow
                    />
                  

                  
                    <IonLabel position="floating">Deadline *</IonLabel>
                    
                     <IonDatetimeButton datetime="datetime">

                         <IonModal keepContentsMounted={true}>
                          <IonDatetime
                            id="datetime"
                            onIonChange={(e) => {
                              const value = e.detail.value;
                              if (typeof value === 'string') {
                                setDeadline(value);
                              } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
                                setDeadline(value[0]);
                              }
                            }}
                          ></IonDatetime>
      
                    </IonModal>
                    </IonDatetimeButton>
                    
                

                    <IonLabel position="floating">Add Team Member</IonLabel>
                    <IonInput
                    fill='outline'
                      value={memberEmail}
                      onIonChange={(e) => setMemberEmail(e.detail.value!)}
                      type="email"
                      placeholder="Enter member's email"
                    />
                    {emailValid === true && (
                      <IonButton 
                        slot="end" 
                        onClick={handleAddMember}
                        fill="clear"
                        color="primary"
                      >
                        Add
                      </IonButton>
                    )}
                    {emailValid === false && (
                      <IonLabel color="danger" className="ion-padding-start">
                        User not found
                      </IonLabel>
                    )}
               

                  {members.length > 0 && (
                    <div className="members-list">
                      <IonLabel>Team Members:</IonLabel>
                      <IonList lines="none">
                        {members.map((email, idx) => (
                          <IonItem key={idx} className="member-item">
                            <IonLabel>{email}</IonLabel>
                            <IonButton 
                              fill="clear" 
                              color="danger"
                              onClick={() => handleRemoveMember(email)}
                            >
                              Remove
                            </IonButton>
                          </IonItem>
                        ))}
                      </IonList>
                    </div>
                  )}

                  <IonButton 
                    expand="block" 
                    onClick={handleSubmit} 
                    className="ion-margin-top submit-button"
                    color={"secondary"}
                  >
                    Create Project
                  </IonButton>
                </IonCardContent>
              </IonCard>
        </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
        </div>
        <IonLoading isOpen={loading} message="Creating Project..." />
        <IonToast 
          isOpen={!!error} 
          message={error} 
          duration={3000} 
          onDidDismiss={() => setError('')} 
          color="danger"
        />
      </IonContent>
    </IonPage>
  );
};

export default CreateProject;