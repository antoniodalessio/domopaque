export default const config = {
	environments: [
		{
			name: 'soggiorno',
			devicesip: '',
			type: 'master'
		},
		{
			name: 'veranda',
			devicesip: ['192.168.1.10'],
			type: 'slave'
		},
	]
}