
## **UC Quicknotes using Text**
Status: draft-**defined**\-implemented-tested
### **Preconditions**
- user has a Gaia token
### **Trigger**
- User clicks Android Widget Bookmark https://f2fnetwork.de/gaia-quicknotes.html?token=demo
### **Actions**
1.  Show a very simple and FAST loading website (html with plain js and css included) which shows a textarea.  
	Styling should be like AdminLTE UI  
	(see http://www.f2fnetwork.de/application/F2F-49/html/index.html?user=demo )
2.  Text is entered into textarea and sent to Gaia.  
	autogrow textarea while typing
3.  The ajax reply is shown. Gaia has parsed the text and maybe re-structured it. 
	Gaia reply is shown as history below input area.
4.  Language switch: Deutsch/English/... (later more languages).  
 	Then labels are changed immediately without reloading.
5.  Show some text to explain the usage:  
    "say 'task for alexander. buy some milk.'  
    or: 'tomorrow at 12:15 . meeting with Julia. remind me 30min in advance'".
6.  a link to Gaia to see the results and to edit data

### **implementation**
1.  text is stored on php webserver or to Gaia directly
2.  Gaia converts text into tasks/events/notes

Demo: https://f2fnetwork.de/gaia-quicknotes.html?token=demo

### **Alternatives**
Alternatives will be implemented LATER, after evaluation.
- (??needed?) if called without token, ask for token and reload using ?token=x
- use speech recognition
- with pubkey for encryption and different target server
- later: get settings, e.g. language, keywords from gaia before text input
- quickly add tags (icons): fun task, painful task (sad smily), urgent ("bomb" icon), important task (!), shop, learn, job, hobby, ...

### **Open issues**
- define API to Gaia
---

## **UC Quicknotes using speech**
Status: draft-**defined**-implemented-tested
### **Preconditions**
- user has a Gaia token
### **Trigger**
- User clicks Android Widget Bookmark https://f2fnetwork.de/gaia-quicknotes.html?token=demo
### **Actions**
1. Show textarea with mic symbol
2. User can hit microphone icon and speak text (Web_Speech_API)
3. Errors are displayed e.g. if no text was understood.
4. Language switch: german/english/... (later more languages). Has effect on speech API.
5. same as in "UC Quicknotes using Text"

### **implementation**
see
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- https://shapeshed.com/html5-speech-recognition-api/
- https://github.com/Daniel-Hug/speech-input
- https://www.google.com/intl/de/chrome/demos/speech.html
- web speech grammar: https://www.w3.org/TR/jsgf/

### **Alternatives**
Alternatives will be implemented LATER, after evaluation.

- (opt.) provide a grammar to aid text recognition:  
	task/event/note, label, opt.: description, responsible person, a date, reminder, keywords

### **Open issues**
- none
---
