export type Identity = {
    user: User;
    token: string;
}

export type User = {
    id: string;
    display_name: string;
    profile_image_url: string;
    faceit: string;
    faceit_level: string;
    faceit_elo: string;
}

export type Player = {
    id: string;
    name: string;
    image: string;
    faceit: string;
    level: string;
    elo: string;
}

export type Request = {
    from: string;
    to: string;
}

export type Couple = {
    player1: string;
    player2: string;
}

export type PlayersResponse = {
    players: Player[];
    couples: Couple[];
}