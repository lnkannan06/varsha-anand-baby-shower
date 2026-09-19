/** Run createShowerRSVP in your own Google Apps Script project.
 * Creates one Google Form and one private response spreadsheet.
 * Re-running reuses the saved IDs. No emails are sent.
 */
function createShowerRSVP() {
  const props = PropertiesService.getScriptProperties();
  const existing = props.getProperty('SHOWER_FORM_ID');
  if (existing) {
    const form = FormApp.openById(existing);
    console.log('Existing form - check questions before publishing: ' + form.getEditUrl());
    console.log('Guest URL: ' + form.getPublishedUrl());
    console.log('Response sheet: https://docs.google.com/spreadsheets/d/' + props.getProperty('SHOWER_SHEET_ID') + '/edit');
    return;
  }
  const form = FormApp.create('Varsha & Anand - Baby Shower RSVP', false);
  props.setProperty('SHOWER_FORM_ID', form.getId());
  form.setDescription('Saturday, October 31, 2026 | 11 AM-3 PM, Pacific time. At Varsha & Anand’s home. Kindly RSVP by October 17. One response per household. Guest details are for the organizers.');
  form.setCollectEmail(false).setLimitOneResponsePerUser(false).setAllowResponseEdits(true).setPublishingSummary(false).setShowLinkToRespondAgain(false);
  form.setConfirmationMessage('Thank you! Your RSVP has been saved. Keep your edit-response link if you need to update your plans.');
  form.addTextItem().setTitle('Your name / household names').setRequired(true);
  form.addTextItem().setTitle('Email address').setValidation(FormApp.createTextValidation().requireTextIsEmail().build()).setRequired(true);
  const attendance = form.addMultipleChoiceItem().setTitle('Will you join us?').setRequired(true);
  const yesPage = form.addPageBreakItem().setTitle('Your guests');
  const adult = form.addListItem().setTitle('Number of adults, including yourself').setChoiceValues(Array.from({length:20}, (_,i)=>String(i+1))).setRequired(true);
  form.addListItem().setTitle('Number of children').setChoiceValues(Array.from({length:21}, (_,i)=>String(i))).setRequired(true);
  form.addParagraphTextItem().setTitle('Names of others attending with you').setRequired(false);
  form.addParagraphTextItem().setTitle('Food allergies / dietary needs').setHelpText('The menu will be vegetarian. Let us know about vegan or eggless requirements.').setRequired(false);
  const wishes = form.addPageBreakItem().setTitle('A little love for the parents');
  form.addParagraphTextItem().setTitle('Your message for Varsha & Anand (optional)').setRequired(false);
  attendance.setChoices([attendance.createChoice('Yes, with love!', yesPage), attendance.createChoice('Sorry to miss it', wishes)]);
  const sheet = SpreadsheetApp.create('Varsha & Anand - Private RSVP Responses');
  props.setProperty('SHOWER_SHEET_ID', sheet.getId());
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());
  console.log('1. Open and review form: ' + form.getEditUrl());
  console.log('2. Publish the form with responder access for anyone with the link.');
  console.log('3. Paste this full URL into config.js formUrl: ' + form.getPublishedUrl());
  console.log('4. Private response spreadsheet (do not paste into the website): ' + sheet.getUrl());
}
