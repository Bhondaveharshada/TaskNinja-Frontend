import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonSplitPane,
  IonMenu,
  IonContent as IonMenuContent,
  IonList,
  IonItem,
  IonMenuToggle,
  IonLabel,
  IonButtons,
  IonMenuButton,
  IonRouterOutlet,
  IonContent,
} from '@ionic/react';
import { useState } from 'react';
import OwnProjects from '../components/Projects/OwnProjects';
import OtherProjects from '../components/Projects/OtherProjects';
import CreateProject from '../components/Projects/CreateProjects';
import { Route } from 'react-router';

const Dashboard: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<'my' | 'other'>('my');

  return (
    <IonSplitPane contentId="main">
      {/* Side Menu */}
      <IonMenu contentId="main">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonMenuContent>
          <IonList>
            <IonMenuToggle autoHide={false}>
              <IonItem button onClick={() => setActiveMenu('my')}>
                <IonLabel>My Projects</IonLabel>
              </IonItem>
            </IonMenuToggle>
            <IonMenuToggle autoHide={false}>
              <IonItem button onClick={() => setActiveMenu('other')}>
                <IonLabel>Other Projects</IonLabel>
              </IonItem>
            </IonMenuToggle>
          </IonList>
        </IonMenuContent>
      </IonMenu>

      {/* Main Content */}
      
       <IonContent id='main'>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>
              {activeMenu === 'my' ? 'My Projects' : 'Other Projects'}
            </IonTitle>
          </IonToolbar>
       

        {/* Main Router Outlet */}
        <IonRouterOutlet>
          <Route exact path="/dashboard">
            {activeMenu === 'my' ? <OwnProjects /> : <OtherProjects />}
          </Route>

          <Route exact path="/dashaboard/project/create"  >
          <CreateProject></CreateProject>
          </Route>
        </IonRouterOutlet>
      </IonContent>
    </IonSplitPane>
  );
};

export default Dashboard;
