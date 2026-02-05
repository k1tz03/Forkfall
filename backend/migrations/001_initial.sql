-- FORKFALL Initial Schema
-- Run with: psql -U forkfall -d forkfall -f 001_initial.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Actors table (device-based identity)
CREATE TABLE IF NOT EXISTS actors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_fingerprint TEXT NOT NULL UNIQUE,
    trust_score DECIMAL(3,2) DEFAULT 1.0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Masks table (personas for actors in lanes)
CREATE TABLE IF NOT EXISTS masks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES actors(id) ON DELETE CASCADE,
    lane TEXT NOT NULL,
    rotates_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Forks table (binary choice prompts)
CREATE TABLE IF NOT EXISTS forks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prompt TEXT NOT NULL CHECK (length(prompt) <= 90),
    left_label TEXT NOT NULL CHECK (length(left_label) <= 24),
    right_label TEXT NOT NULL CHECK (length(right_label) <= 24),
    left_asset_id UUID,
    right_asset_id UUID,
    intent_lane TEXT NOT NULL,
    mood TEXT,
    energy TEXT,
    time_fit_s INTEGER,
    cognitive_load TEXT,
    parent_fork_id UUID REFERENCES forks(id),
    mutation_type TEXT,
    safety_age_gate TEXT DEFAULT 'all',
    safety_sensitivity TEXT DEFAULT 'normal',
    safety_flags TEXT[] DEFAULT '{}',
    created_by_actor_id UUID REFERENCES actors(id),
    created_by_mask_id UUID REFERENCES masks(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interactions table (swipes, skips, twists)
CREATE TABLE IF NOT EXISTS interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES actors(id) ON DELETE CASCADE,
    fork_id UUID REFERENCES forks(id) ON DELETE CASCADE,
    interaction_type TEXT NOT NULL CHECK (interaction_type IN ('swipe_left', 'swipe_right', 'skip', 'twist')),
    dwell_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reports table (content reports)
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES actors(id) ON DELETE CASCADE,
    fork_id UUID REFERENCES forks(id) ON DELETE CASCADE,
    reason TEXT NOT NULL CHECK (reason IN ('inappropriate', 'spam', 'harassment', 'hate_speech', 'other')),
    state TEXT DEFAULT 'pending' CHECK (state IN ('pending', 'reviewed', 'dismissed', 'actioned')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_actors_device_fingerprint ON actors(device_fingerprint);
CREATE INDEX IF NOT EXISTS idx_masks_actor_id ON masks(actor_id);
CREATE INDEX IF NOT EXISTS idx_forks_intent_lane ON forks(intent_lane, energy, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forks_parent ON forks(parent_fork_id);
CREATE INDEX IF NOT EXISTS idx_forks_created_by ON forks(created_by_actor_id);
CREATE INDEX IF NOT EXISTS idx_forks_created_at ON forks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_interactions_actor ON interactions(actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_interactions_fork ON interactions(fork_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_interactions_type ON interactions(interaction_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_fork ON reports(fork_id, state);
CREATE INDEX IF NOT EXISTS idx_reports_state ON reports(state, created_at DESC);

-- Seed data: Sample forks for testing
INSERT INTO actors (id, device_fingerprint, trust_score, status)
VALUES ('00000000-0000-0000-0000-000000000001', 'system', 1.0, 'active')
ON CONFLICT (device_fingerprint) DO NOTHING;

INSERT INTO forks (prompt, left_label, right_label, intent_lane, mood, energy, created_by_actor_id)
VALUES
    ('Would you rather have the power to fly or be invisible?', 'Fly', 'Invisible', 'vibe', 'playful', 'chill', '00000000-0000-0000-0000-000000000001'),
    ('Pineapple on pizza?', 'Yes please', 'Never', 'debate', 'spicy', 'chill', '00000000-0000-0000-0000-000000000001'),
    ('Morning person or night owl?', 'Early bird', 'Night owl', 'discover', 'playful', 'chill', '00000000-0000-0000-0000-000000000001'),
    ('Would you rather know how you die or when you die?', 'How', 'When', 'reflect', 'serious', 'intense', '00000000-0000-0000-0000-000000000001'),
    ('Cats or dogs?', 'Cats', 'Dogs', 'vibe', 'wholesome', 'chill', '00000000-0000-0000-0000-000000000001'),
    ('If you could only eat one cuisine forever?', 'Italian', 'Japanese', 'decide', 'playful', 'balanced', '00000000-0000-0000-0000-000000000001'),
    ('Would you rather have unlimited money or true love?', 'Money', 'Love', 'reflect', 'serious', 'intense', '00000000-0000-0000-0000-000000000001'),
    ('Beach vacation or mountain retreat?', 'Beach', 'Mountains', 'decide', 'playful', 'chill', '00000000-0000-0000-0000-000000000001'),
    ('Live forever or live twice as long perfectly healthy?', 'Forever', 'Twice healthy', 'reflect', 'serious', 'intense', '00000000-0000-0000-0000-000000000001'),
    ('Coffee or tea?', 'Coffee', 'Tea', 'vibe', 'playful', 'chill', '00000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;
