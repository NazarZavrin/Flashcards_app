import React, { ComponentProps, useState } from 'react';
import styles from './AuthForm.module.css';
import Tabs from '../components/Tabs';
import Tab from '../components/Tab';
import LoginForm from './LoginForm';
import CreateAccountForm from './CreateAccountForm';

export type UserDataForLogin = Pick<IUserData, 'email' | 'password'>
export interface IUserData {
    name: string;
    email: string;
    password: string;
}

function AuthForm(props: ComponentProps<'section'>) {
    const [activeTab, setActiveTab] = useState<'log-in' | 'create-account'>('log-in');
    const [loginFormInputs, setLoginFormInputs] = useState<UserDataForLogin>({ email: 'ann@gmail.com', password: 'annp' });
    const [createAccountFormInputs, setCreateAccountFormInputs] = useState<IUserData>({ name: 'Ann', email: 'ann@gmail.com', password: 'annp' });
    const switchTab = () => setActiveTab(activeTab === 'log-in' ? 'create-account' : 'log-in');
    return (
        <section {...props} className={styles.authForm + ' ' + props.className}>
            <Tabs>
                <Tab active={activeTab !== 'create-account'}
                    onClick={switchTab}
                >Log in</Tab>
                <Tab active={activeTab === 'create-account'}
                    onClick={switchTab}
                >Create account</Tab>
            </Tabs>
            {activeTab === 'create-account' ?
                <CreateAccountForm createAccountFormInputs={createAccountFormInputs} setCreateAccountFormInputs={setCreateAccountFormInputs} onLogin={switchTab} /> :
                <LoginForm loginFormInputs={loginFormInputs} setLoginFormInputs={setLoginFormInputs} onCreateAccount={switchTab} />
            }
        </section>
    );
}

export default AuthForm;