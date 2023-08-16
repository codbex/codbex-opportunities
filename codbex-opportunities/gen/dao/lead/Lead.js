const query = require("db/query");
const producer = require("messaging/producer");
const daoApi = require("db/dao");

let dao = daoApi.create({
	table: "CODBEX_ENTITY1",
	properties: [
		{
			name: "Id",
			column: "ENTITY1_ENTITY1ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		},
 {
			name: "Name",
			column: "ENTITY1_NAME",
			type: "VARCHAR",
		},
 {
			name: "CompanyName",
			column: "ENTITY1_COMPANYNAME",
			type: "VARCHAR",
		},
 {
			name: "ContactName",
			column: "ENTITY1_CONTACTNAME",
			type: "VARCHAR",
		},
 {
			name: "ContactDesignation",
			column: "ENTITY1_CONTACTDESIGNATION",
			type: "VARCHAR",
		},
 {
			name: "ContactEmail",
			column: "ENTITY1_CONTACTEMAIL",
			type: "VARCHAR",
		},
 {
			name: "ContactPhone",
			column: "ENTITY1_CONTACTPHONE",
			type: "VARCHAR",
		},
 {
			name: "Industry",
			column: "ENTITY1_INDUSTRY",
			type: "INTEGER",
		},
 {
			name: "LeadStatus",
			column: "ENTITY1_LEADSTATUS",
			type: "INTEGER",
		},
 {
			name: "Owner",
			column: "ENTITY1_OWNER",
			type: "INTEGER",
		}
]
});

exports.list = function(settings) {
	return dao.list(settings);
};

exports.get = function(id) {
	return dao.find(id);
};

exports.create = function(entity) {
	let id = dao.insert(entity);
	triggerEvent("Create", {
		table: "CODBEX_ENTITY1",
		key: {
			name: "Id",
			column: "ENTITY1_ENTITY1ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	dao.update(entity);
	triggerEvent("Update", {
		table: "CODBEX_ENTITY1",
		key: {
			name: "Id",
			column: "ENTITY1_ENTITY1ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CODBEX_ENTITY1",
		key: {
			name: "Id",
			column: "ENTITY1_ENTITY1ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_ENTITY1"');
	if (resultSet !== null && resultSet[0] !== null) {
		if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
			return resultSet[0].COUNT;
		} else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
			return resultSet[0].count;
		}
	}
	return 0;
};

function triggerEvent(operation, data) {
	producer.queue("codbex-opportunities/lead/Lead/" + operation).send(JSON.stringify(data));
}