import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthStackParamList } from '../../types/navigation.types';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';

type Props = { navigation: StackNavigationProp<AuthStackParamList, 'Register'> };

export default function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: string) => (v: string) => setForm((f) => ({ ...f, [key]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim() || form.name.length < 2) e.name = 'Nome deve ter ao menos 2 caracteres';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'E-mail inválido';
    if (form.password.length < 6) e.password = 'Senha deve ter ao menos 6 caracteres';
    if (form.password !== form.confirm) e.confirm = 'Senhas não conferem';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      await register(form.name.trim(), form.email.trim(), form.password);
    } catch (err) {
      Alert.alert('Erro', err instanceof Error ? err.message : 'Falha ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Text style={styles.backText}>← VOLTAR</Text>
            </TouchableOpacity>
            <Text style={styles.logo}>AUTO<Text style={styles.logoAccent}>PARTS</Text></Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.formTitle}>CRIAR CONTA</Text>

            <Input label="Nome completo" value={form.name} onChangeText={set('name')}
              placeholder="Seu nome" autoCapitalize="words" error={errors.name} />

            <Input label="E-mail" value={form.email} onChangeText={set('email')}
              keyboardType="email-address" autoCapitalize="none"
              placeholder="seu@email.com" error={errors.email} />

            <Input label="Senha" value={form.password} onChangeText={set('password')}
              isPassword placeholder="Mín. 6 caracteres" error={errors.password} />

            <Input label="Confirmar senha" value={form.confirm} onChangeText={set('confirm')}
              isPassword placeholder="Repita a senha" error={errors.confirm} />

            <Button label="Criar conta" onPress={handleRegister}
              isLoading={isLoading} fullWidth size="lg" style={styles.btn} />
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
            <Text style={styles.loginLinkText}>
              Já tem conta? <Text style={styles.loginLinkAccent}>Entrar</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingBottom: spacing['2xl'] },
  header: { paddingTop: spacing.lg, paddingBottom: spacing.xl },
  backBtn: { marginBottom: spacing.lg },
  backText: { fontSize: 12, fontWeight: '700', color: colors.textMuted, letterSpacing: 1 },
  logo: { fontSize: 32, fontWeight: '900', color: colors.textPrimary, letterSpacing: 4 },
  logoAccent: { color: colors.primary },
  form: { backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: spacing.xl },
  formTitle: { fontSize: 13, fontWeight: '800', color: colors.textSecondary, letterSpacing: 2, marginBottom: spacing.xl, textAlign: 'center' },
  btn: { marginTop: spacing.sm },
  loginLink: { marginTop: spacing.xl, alignItems: 'center' },
  loginLinkText: { fontSize: 13, color: colors.textMuted },
  loginLinkAccent: { color: colors.primary, fontWeight: '700' },
});