import { TBAApi } from "./tba";

const client = new TBAApi({ apiKey: process.env.TBA_READ_KEY || "" });

/*
 * interativity
 */

const event = process.argv[2]
  ? process.argv[2]
  : prompt("Enter event code (2025ohmv): ") || "2025ohmv";

let year = new Date().getFullYear();

if (!event) {
  console.log("Please specify an event to get teams from");
  process.exit(1);
}

console.log(`checking event: ${event}`);

client.getEvent(event).then((data) => {
  console.log("---");
  console.log(`Found event: ${data.name} (${data.key})`);
  console.log(`Location: ${data.city}, ${data.state_prov}, ${data.country}`);
  console.log(`Dates: ${data.start_date} to ${data.end_date}`);
  console.log("---");

  year = data.year;

  const confirmed = prompt("Is this the correct event? (Y/n): ") || "y";
  if (confirmed?.toLowerCase() !== "y") {
    console.log("Aborting...");
    process.exit(1);
  }
});

console.log("Fetching teams...");

client.getTeamsAtEvent(event).then(async (teams) => {
  console.log("---");
  console.log(`Found ${teams.length} teams at event ${event}`);
  console.log("---");

  console.log("Teams attending:");
  for (const team of teams) {
    console.log(`  - Team ${team.team_number} (${team.nickname})`);
  }
  console.log("---");

  const eventTeams = new Map();

  for (const team of teams) {
    const events = await client.getTeamEvents(team.key, year);
    for (const event of events) {
      const key = `${event.name} (${event.key})`;
      if (!eventTeams.has(key)) {
        eventTeams.set(key, []);
      }
      eventTeams.get(key).push(team.team_number);
    }
  }

  console.log(
    `All events these teams are attending (${eventTeams.size} events):`,
  );
  for (const [eventName, teamNumbers] of eventTeams) {
    console.log(
      `  - ${eventName}: ${
        teamNumbers.length > 3
          ? `${teamNumbers.slice(0, 3).join(", ")} and ${teamNumbers.length - 3} others`
          : teamNumbers.join(", ")
      }`,
    );
  }
  console.log("---");
});
