const mongoose = require('mongoose')

if (process.argv.length < 3) {
	console.log('give password as argument')
	process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.413sbvx.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const phonebookEntrySchema = new mongoose.Schema({
	name: String,
	number: String
})

const PhoneBookEntry = mongoose.model('PhoneBookEntry', phonebookEntrySchema)

if (process.argv.length === 5) {
	const entry = new PhoneBookEntry({
		name: process.argv[3],
		number: process.argv[4]
	})

	entry.save().then(result => {
		console.log(`added ${result.name} number ${result.number} to phonebook`)
		mongoose.connection.close()
	})
}
else if (process.argv.length === 3) {
	console.log('phonebook: ')
	PhoneBookEntry.find({}).then(result => {
		result.forEach(entry => {
			console.log(`${entry.name} ${entry.number}`)
		})
		mongoose.connection.close()
	})
}
else {
	console.log('usage: node mongo.js yourpassword [name] [number]')
	process.exit(1)
}




