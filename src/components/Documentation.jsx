'use client'

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Mermaid from "mermaid-react"

const BasicSystemFlow = `
graph LR
  Source["Source"] <--> System["System\\nGoogle Map\\n(Find safe route for Women)"]
  System <--> Destination["Destination"]
  style Source fill:#ffd7b5
  style System fill:#e6f3ff
  style Destination fill:#ffd7b5
`

const DetailedSystemArchitecture = `
graph TD
  User["User"] --> Input["Input as a source to\\ndestination"]
  User --> Contact["May send to contact\\nnumber"]
  Input --> Dataset[("Train Dataset")]
  Dataset --> Display["Display Route"]
  Display --> Classification["Classification by using SVM"]
  Classification --> Check["Check Route for safety"]
  Check --> Button["If unsafe press button"]
  
  style Dataset fill:#87CEEB
  style User fill:#87CEEB
`

export default function DocumentationPage() {
  const [activeTab, setActiveTab] = useState("abstract")

  const sections = {
    abstract: {
      title: "Abstract",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Crime control, public security especially women security are serious concerns for any country around the world. Police and various intelligence agencies constantly work for the same. Despite constant efforts, patrolling and using different types of technologies, equipment and methods like CCTV surveillance regularly, aerial inspection through simple camera drones (for serious cases) to control the crime, a significant change could not be observed. Moreover, Women protection is still a serious issue in various countries like India. Gender ideologies in India have seen an improving sign among all people within the society in upbringing the social status of women in different workplaces and environments but the status of women security remains the same or has been worsened. So we develop a system who find the safest path for the women while she is going outdoors alone. And also we provide safety to that women when she is in the trouble or in the helpless condition, she can also notify the situation to the family members or to the nearest police stations.
          </p>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Keywords</h3>
            <p className="text-blue-700">Android Application, Women Safety, Java, protection</p>
          </div>
        </div>
      )
    },
    introduction: {
      title: "Introduction",
      content: (
        <p className="text-gray-700 leading-relaxed">
          In today's fast moving world, Women Security is an issue of growing concern. We have read about many unfortunate incidents happening with women and the rate is increasing. Women these days are working women and the globalization has made us aware of gender equality. Earlier the women were restricted only to the household chores. With the changing scenario, women are competing with men in all fields. We can see women going to great success levels in all fields, may it be corporate, scientific, education, business or any other field. Safety of women matters a lot whether at home, outside the home or working place. Last few crimes against women especially the case in Delhi was very dread and fearful. Because of such crimes, women safety has become a major topic. According to the statistics, it is found that every two out of three women have suffered trauma in the last year. According to the survey of women, it is found that women are losing their confidence because of such incidents. By the survey of Delhi government's Women and Child Development Department, around 80% of the women in national capital have fear regarding their safety. Women are harassed not only in the night or evening but also in the day time at their home, working places, or other places like street, club, etc. It is found through the survey that the reason of safety concern is the lack of gender-friendly environment and improper functional infrastructure such as consumption of alcohol and drugs in open area, lack of adequate lighting, safe public toilets, sidewalks, lack of effective police service, lack of properly working helpline numbers, etc. A huge percentage of women have no faith that police can curb such harassment cases. There is an urgent need to understand and solve this problem of women safety so that they can also grow equally like men in their own country.
        </p>
      )
    },
    methodology: {
      title: "Methodology",
      content: (
        <div className="space-y-8">
          <section>
            <h3 className="text-2xl font-semibold mb-4 text-blue-800">Existing System</h3>
            <div className="mb-6">
              <h4 className="font-semibold mb-2 text-blue-700">Basic System Flow</h4>
              <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <Mermaid chart={BasicSystemFlow} />
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              There is a variety of applications for women protection when they are in dangerous situation. The disadvantages of using these applications are they only send the alert messages to the saved contacts. Because of previous systems there is less possibilities of overcome the dangerous situations of women. Previous applications also have GPS tracking system for to track the women location but it has not specific range. Existing system don't have the feature that is it don't sends the alert message to nearby cell phones.
            </p>
            <h4 className="font-semibold mt-4 mb-2 text-blue-700">Disadvantages:</h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>It doesn't provide security.</li>
              <li>All the existing systems must be connected to the GPRS service to work properly, hence cannot be used during emergency if there is no internet connectivity.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-semibold mb-4 text-blue-800">Proposed System</h3>
            <div className="mb-6">
              <h4 className="font-semibold mb-2 text-blue-700">Detailed System Architecture</h4>
              <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <Mermaid chart={DetailedSystemArchitecture} />
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              To develop a system for android users for keeping track through several applications. This application uses GPS for identifying the location of the person in trouble and the system can be divided into two modules:
            </p>
            <ol className="list-decimal list-inside mb-4 text-gray-700 space-y-1">
              <li>First module can be the victim's phone i.e the root device which uses 3G/2G data connection for tracking the location of the victim through GPS.</li>
              <li>Second module can be the mobile phone of registered contacts either police or friends or family members which receives the message containing URL of location of victim that is sent from the root device.</li>
            </ol>
            <h4 className="font-semibold mt-4 mb-2 text-blue-700">Advantages:</h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Your loved ones and close friends can automatically receive text message.</li>
              <li>Exact time of the alert triggered.</li>
              <li>Your location (with map link).</li>
              <li>The battery level of your phone.</li>
              <li>Automatic prompt for activating location.</li>
              <li>Self-defense video for guiding victim, how to remain safe and protect in dangerous situations arising.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-semibold mb-4 text-blue-800">Project Modules</h3>
            <ol className="list-decimal list-inside text-gray-700 space-y-1">
              <li>Finding Safest Root</li>
              <li>Emergency Mail Send</li>
              <li>Display Route on Map</li>
            </ol>
          </section>

          <section>
            <h3 className="text-2xl font-semibold mb-4 text-blue-800">Algorithm Used</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Support Vector Machine or SVM is one of the most popular Supervised Learning algorithms, which is used for Classification as well as Regression problems. However, primarily, it is used for Classification problems in Machine Learning. The goal of the SVM algorithm is to create the best line or decision boundary that can segregate n-dimensional space into classes so that we can easily put the new data point in the correct category in the future. This best decision boundary is called a hyper plane.
            </p>
          </section>
        </div>
      )
    },
    conclusion: {
      title: "Conclusion",
      content: (
        <p className="text-gray-700 leading-relaxed">
          Unfortunately, the safety of women is in doubt and security is not concerned. Many headlines still coming across against women indicates that increasing trends of such sexual assault rapes still happening in today's generation. Around 80 percent of women are losing confidence and have fear of the realization of freedom. So we are trying to contribute little efforts towards women which will ensure the safety and respect for women so that she canal so have the right to grow equally like men. This mobile application is very much helpful for anyone. This application will help the user by scanning the QR code which will be nothing but she can attach the vehicle detail send through GPS the current address will be fetched and send it to any contact depending on the user. Here the user can take precautions before coming to the actual danger. It is to let every women is now safe to travel alone as someone is getting their updated location and also has vehicle information. For the future, we have in mind to extend this app where she can also contact nearby police patrolling vans in case of need. This project that I have made is small scale but has a large development scope and I look further to the day it can be extended and used by all common people so in totality this project is an initiative taken by the youth community to contribute to the betterment of the society in whatever way we can.
        </p>
      )
    },
    references: {
      title: "References",
      content: (
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Ye Zhang, Asif Ali Laghari, Muhhammad, Rizwan Asif "Image processing based Proposed Drone For detecting and controlling street Crimes" 2017 IEEE 17th International Conference on Communication Technology (ICCT), 27-30 Oct. 2017.</li>
          <li>Amarjot Singh, Devendra Patil, S.N.Omkar "Eye in the Sky: Real-Time Drone Surveillance System(DSS) for violent Individuals Identification using Scatter Net Hybrid Deep Learning Network" 2018 IEEE/CVF Conference on computer Vision And Pattern Recognition Workshops(CVPRW), 18-22 June 2018.</li>
          <li>Margherita bonetto, Pavel Korshunov, Giovanni Ramponi, Touragj Ebrahimi "Privacy in Mini-Drone based video survelliance" 2015 IEEE International Conference on Image Processing (ICP), 27-30 Sept. 2015.</li>
          <li>Ya-ching chang, Hua-Tsung Chen, Jen-Hui Chuang, I-ChunLiao "Pedestrian Detection in Aerial Image using Vanishing Point Transformation and Deep Learning" 2018 25th IEEE International Conference on Image Processing (ICIP), 7-10 Oct. 2018.</li>
          <li>Sunyoung Cho, Dae Hoe Kim, Yong Woon Park "Learning dronecontrol actions in Surveillance videos" 2017 17th International conference on Control, Automation and Sysytems (ICCAS), 18-21 oct. 2017.</li>
          <li>Laird Dornin "Programming Android" second edition "O'Reilly Media, Inc.", 2012 -1-542 pages.</li>
          <li>"WOMEN'S SECURITY", Android App developed by AppSoftIndia, December 17, 2013.</li>
          <li>https://play.google.com/store/apps/details?id=com.zayaninfotech</li>
        </ol>
      )
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-blue-50 to-white"
    >
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <header className="text-center space-y-4 mb-12">
              <h1 className="text-4xl font-bold text-blue-900">Women Safety SOS Application</h1>
              <div className="text-gray-600">
                <p className="font-semibold">Prof. Aditi Patil¹, Shraddha R. Ramshette², Chaitali L. Dhengle³, Hamd J. Ansari⁴, Sayali S. Madhurkar⁵</p>
                <p className="text-sm">¹Professor, ²,³,⁴,⁵ Students, Department of Computer Engineering</p>
                <p className="text-sm">SKN Sinhgad Institute of Technology and Science, Kusgaon (BK), Pune</p>
              </div>
            </header>

            <nav className="mb-12">
              <div className="flex flex-wrap justify-center gap-2">
                {Object.entries(sections).map(([key, section]) => (
                  <motion.button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-200 
                      ${activeTab === key
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {section.title}
                  </motion.button>
                ))}
              </div>
            </nav>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="prose max-w-none"
              >
                <h2 className="text-3xl font-bold mb-6 text-blue-900">{sections[activeTab].title}</h2>
                {sections[activeTab].content}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}