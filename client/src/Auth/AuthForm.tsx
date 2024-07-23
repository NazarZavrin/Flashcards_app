import React, { ComponentProps, useState } from 'react';
import styles from './AuthForm.module.css';
import Tabs from '../components/Tabs';
import Tab from '../components/Tab';
import LoginForm from './LoginForm';
import CreateAccountForm from './CreateAccountForm';

function AuthForm(props: ComponentProps<"section">) {
    const [activeTab, setActiveTab] = useState<"log-in" | "create-account">("log-in");
    const switchTab = () => setActiveTab(activeTab === "log-in" ? "create-account" : "log-in");
    return (
        <section {...props} className={styles.authForm + ' ' + props.className}>
            <Tabs>
                <Tab active={activeTab === "log-in"}
                    onClick={switchTab}
                >Log in</Tab>
                <Tab active={activeTab !== "log-in"}
                    onClick={switchTab}
                >Create account</Tab>
            </Tabs>
            {activeTab === "create-account" ?
                <CreateAccountForm onLogin={switchTab} /> :
                <LoginForm onCreateAccount={switchTab}/>
            }
        </section>
    );
}

export default AuthForm;